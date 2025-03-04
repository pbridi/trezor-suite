import TrezorConnect, {
    DEVICE,
    DEVICE_EVENT,
    TRANSPORT_EVENT,
    WEBEXTENSION,
} from '@trezor/connect-web';

import { TrezorConnectDevice, Dispatch, Field, GetState } from '../types';

import * as ACTIONS from './index';

type ConnectOptions = Parameters<(typeof TrezorConnect)['init']>[0];
export type TrezorConnectAction =
    | { type: typeof ACTIONS.ON_SELECT_DEVICE; path: string }
    | { type: typeof DEVICE.CONNECT; device: TrezorConnectDevice }
    | { type: typeof DEVICE.CONNECT_UNACQUIRED; device: TrezorConnectDevice }
    | { type: typeof DEVICE.DISCONNECT; device: TrezorConnectDevice }
    | { type: typeof ACTIONS.ON_CHANGE_CONNECT_OPTIONS; payload: ConnectOptions }
    | { type: typeof ACTIONS.ON_HANDSHAKE_CONFIRMED }
    | {
          type: typeof ACTIONS.ON_CHANGE_CONNECT_OPTION;
          payload: { option: Field<any>; value: any };
      };

export function onSelectDevice(path: string) {
    return {
        type: ACTIONS.ON_SELECT_DEVICE,
        path,
    };
}

export const onConnectOptionChange = (option: string, value: any) => ({
    type: ACTIONS.ON_CHANGE_CONNECT_OPTION,
    payload: {
        option,
        value,
    },
});

export const init =
    (options: Partial<Parameters<(typeof TrezorConnect)['init']>[0]> = {}) =>
    async (dispatch: Dispatch) => {
        window.TrezorConnect = TrezorConnect;

        // The event `WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM` is coming from @trezor/connect-webextension/proxy
        // that is replacing @trezor/connect-web when connect-explorer is run in connect-explorer-webextension
        // so Typescript cannot recognize it.
        // @ts-expect-error
        TrezorConnect.on(WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM, event => {
            if (event.type === WEBEXTENSION.CHANNEL_HANDSHAKE_CONFIRM) {
                dispatch({ type: ACTIONS.ON_HANDSHAKE_CONFIRMED });
            }
        });

        TrezorConnect.on(DEVICE_EVENT, event => {
            dispatch({
                type: event.type,
                device: event.payload,
            });
        });

        TrezorConnect.on(TRANSPORT_EVENT, _event => {
            // this type of event should not be emitted in "popup mode"
        });

        const { host } = window.location;

        if (process?.env?.__TREZOR_CONNECT_SRC && host !== 'connect.trezor.io') {
            window.__TREZOR_CONNECT_SRC = process?.env?.__TREZOR_CONNECT_SRC;
        }
        // yarn workspace @trezor/connect-explorer dev starts @trezor/connect-web on localhost port
        // so we may use it
        if (!window.__TREZOR_CONNECT_SRC && host.startsWith('localhost')) {
            // use local connect for local development
            window.__TREZOR_CONNECT_SRC = `${window.location.origin}/`;
        }

        if (window.location.search.includes('trezor-connect-src')) {
            const search = new URLSearchParams(window.location.search);
            window.__TREZOR_CONNECT_SRC = search.get('trezor-connect-src')?.toString();
        }

        if (options.connectSrc) {
            window.__TREZOR_CONNECT_SRC = options.connectSrc;
        }

        if (!window.__TREZOR_CONNECT_SRC) {
            console.log('using production @trezor/connect');
        } else {
            console.log('using @trezor/connect hosted on: ', window.__TREZOR_CONNECT_SRC);
        }

        const connectOptions = {
            transportReconnect: true,
            popup: true,
            debug: true,
            lazyLoad: true,
            manifest: {
                email: 'info@trezor.io',
                appUrl: '@trezor/suite',
            },
            trustedHost: false,
            connectSrc: window.__TREZOR_CONNECT_SRC,
            ...options,
        };

        try {
            await TrezorConnect.init(connectOptions);
        } catch (err) {
            console.log('ERROR', err);

            return;
        }

        dispatch({ type: ACTIONS.ON_CHANGE_CONNECT_OPTIONS, payload: connectOptions });
    };

export const onSubmitInit = () => async (dispatch: Dispatch, getState: GetState) => {
    const { connect } = getState();
    // Disposing TrezorConnect to init it again.
    await TrezorConnect.dispose();

    return dispatch(init(connect.options));
};
