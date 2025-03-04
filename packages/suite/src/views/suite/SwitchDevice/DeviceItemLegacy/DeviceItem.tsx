import { useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import styled, { useTheme } from 'styled-components';
import { variables, Icon, motionAnimation, RotateDeviceImage } from '@trezor/components';
import * as deviceUtils from '@suite-common/suite-utils';

import {
    selectDevice,
    acquireDevice,
    createDeviceInstance,
    selectDeviceThunk,
} from '@suite-common/wallet-core';
import { Translation } from 'src/components/suite';
import { useDispatch, useSelector } from 'src/hooks/suite';
import { goto } from 'src/actions/suite/routerActions';
import { OpenGuideFromTooltip } from 'src/components/guide';

import { WalletInstance } from './WalletInstance';
import { ColHeader } from './ColHeader';
import { AddWalletButton } from './AddWalletButton';
import { DeviceHeaderButton } from './DeviceHeaderButton';

import type { TrezorDevice, AcquiredDevice, ForegroundAppProps } from 'src/types/suite';
import type { getBackgroundRoute } from 'src/utils/suite/router';
import { spacingsPx } from '@trezor/theme';
import { DeviceStatusText } from './DeviceStatusText';

const DeviceWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;

    & + & {
        margin-top: ${spacingsPx.xxxl};
    }
`;

const Device = styled.div`
    display: flex;
    align-items: center;
`;

const DeviceTitle = styled.span`
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${({ theme }) => theme.TYPE_DARK_GREY};
`;

const DeviceActions = styled.div`
    display: flex;
    align-items: center;
    margin-left: 20px;
`;

const Col = styled.div<{ $grow?: number }>`
    display: flex;
    flex-grow: ${({ $grow }) => $grow || 0};
    align-items: flex-start;
    flex-direction: column;
`;

const WalletsWrapper = styled.div<{ $enabled: boolean }>`
    opacity: ${({ $enabled }) => ($enabled ? 1 : 0.5)};
    pointer-events: ${({ $enabled }) => ($enabled ? 'unset' : 'none')};
    padding-bottom: ${({ $enabled }) => ($enabled ? '0px' : '24px')};
    margin-left: 37px;
    margin-top: 24px;

    @media (max-width: ${variables.SCREEN_SIZE.SM}) {
        margin-left: 0;
    }
`;

const WalletsTooltips = styled.div`
    display: flex;
    justify-content: flex-end;
    padding-bottom: 10px;
`;

const WalletsCount = styled(ColHeader)`
    flex: 1;
    justify-content: flex-start;
    white-space: nowrap;
`;

const InstancesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${spacingsPx.xs};
`;

const DeviceHeader = styled.div`
    display: flex;
    align-items: center;
    flex: 1;
`;

const DeviceImageWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 21px;
    height: 36px;
    margin-right: 16px;
`;

const ExpandIcon = styled(Icon)<{ $isActive: boolean }>`
    margin-left: 24px;

    transform: ${({ $isActive }) => ($isActive ? 'rotate(0deg)' : 'rotate(180deg)')};
`;

// TODO: this is going to be a problem with different col headers length since they won't be aligned with the columns inside WalletInstance
const ColRememberHeader = styled(ColHeader)``;
const ColEjectHeader = styled(ColHeader)`
    margin: 0 20px 0 32px;
`;

interface DeviceItemProps {
    device: TrezorDevice;
    instances: AcquiredDevice[];
    onCancel: ForegroundAppProps['onCancel'];
    backgroundRoute: ReturnType<typeof getBackgroundRoute>;
}

export const DeviceItemLegacy = ({
    device,
    instances,
    onCancel,
    backgroundRoute,
}: DeviceItemProps) => {
    const selectedDevice = useSelector(selectDevice);
    const dispatch = useDispatch();

    const theme = useTheme();
    const [isExpanded, setIsExpanded] = useState(true);

    const deviceStatus = deviceUtils.getStatus(device);
    const deviceModelInternal = device.features?.internal_model;

    const needsAttention = deviceUtils.deviceNeedsAttention(deviceStatus);
    const isUnknown = device.type !== 'acquired';
    const isSelected = deviceUtils.isSelectedDevice(selectedDevice, device);
    const instancesWithState = instances.filter(i => i.state);

    const handleRedirection = async () => {
        // Preserve route for dashboard or wallet context only. Redirect from other routes to dashboard index.
        const isWalletOrDashboardContext =
            backgroundRoute && ['wallet', 'dashboard'].includes(backgroundRoute.app);
        if (!isWalletOrDashboardContext) {
            await dispatch(goto('suite-index'));
        }

        // Subpaths of wallet are not available to all account types (e.g. Tokens tab not available to BTC accounts).
        const isWalletSubpath =
            backgroundRoute?.app === 'wallet' && backgroundRoute?.name !== 'wallet-index';
        if (isWalletSubpath) {
            await dispatch(goto('wallet-index'));
        }

        const preserveParams = false;
        onCancel(preserveParams);
    };

    const selectDeviceInstance = (instance: DeviceItemProps['device']) => {
        dispatch(selectDeviceThunk(instance));
        handleRedirection();
    };

    const addDeviceInstance = async (instance: DeviceItemProps['device']) => {
        await dispatch(createDeviceInstance({ device: instance }));
        handleRedirection();
    };

    const onSolveIssueClick = () => {
        const needsAcquire =
            device.type === 'unacquired' ||
            deviceStatus === 'used-in-other-window' ||
            deviceStatus === 'was-used-in-other-window';
        if (needsAcquire) {
            dispatch(acquireDevice(device));
        } else {
            selectDeviceInstance(device);
        }
    };

    const onDeviceSettingsClick = async () => {
        // await needed otherwise it just selects first account (???)
        await dispatch(goto('settings-device'));
        if (!isSelected) {
            dispatch(selectDeviceThunk(device));
        }
    };

    return (
        <DeviceWrapper>
            <Device>
                <DeviceHeader>
                    {deviceModelInternal && (
                        <DeviceImageWrapper>
                            <RotateDeviceImage
                                animationHeight="36px"
                                animationWidth="36px"
                                deviceModel={deviceModelInternal}
                                deviceColor={device?.features?.unit_color}
                            />
                        </DeviceImageWrapper>
                    )}
                    <Col $grow={1}>
                        <DeviceTitle>{device.label}</DeviceTitle>
                        <DeviceStatusText device={device} />
                    </Col>

                    <DeviceActions>
                        <DeviceHeaderButton
                            needsAttention={needsAttention}
                            device={device}
                            onSolveIssueClick={onSolveIssueClick}
                            onDeviceSettingsClick={onDeviceSettingsClick}
                        />
                        {!needsAttention && (
                            <ExpandIcon
                                useCursorPointer
                                size={24}
                                icon="ARROW_DOWN"
                                color={theme.TYPE_LIGHT_GREY}
                                hoverColor={theme.TYPE_LIGHTER_GREY}
                                $isActive={!isExpanded}
                                onClick={() => setIsExpanded(!isExpanded)}
                            />
                        )}
                    </DeviceActions>
                </DeviceHeader>
            </Device>
            {!needsAttention && (
                <AnimatePresence initial={false}>
                    {!isUnknown && isExpanded && (
                        <motion.div {...motionAnimation.expand}>
                            <WalletsWrapper $enabled>
                                {instancesWithState.length > 0 && (
                                    <WalletsTooltips>
                                        <WalletsCount>
                                            <Translation
                                                id="TR_COUNT_WALLETS"
                                                values={{ count: instancesWithState.length }}
                                            />
                                        </WalletsCount>
                                        <ColRememberHeader
                                            tooltipOpenGuide={
                                                <OpenGuideFromTooltip id="/1_initialize-and-secure-your-trezor/8_remember-and-eject.md" />
                                            }
                                            tooltipContent={
                                                <Translation id="TR_REMEMBER_ALLOWS_YOU_TO" />
                                            }
                                        >
                                            <Translation id="TR_REMEMBER_HEADING" />
                                        </ColRememberHeader>
                                        <ColEjectHeader
                                            tooltipOpenGuide={
                                                <OpenGuideFromTooltip id="/1_initialize-and-secure-your-trezor/8_remember-and-eject.md" />
                                            }
                                            tooltipContent={
                                                <Translation id="TR_EJECT_WALLET_EXPLANATION" />
                                            }
                                        >
                                            <Translation id="TR_EJECT_HEADING" />
                                        </ColEjectHeader>
                                    </WalletsTooltips>
                                )}

                                <InstancesWrapper>
                                    {instancesWithState.map((instance, index) => (
                                        <WalletInstance
                                            key={`${instance.id}-${instance.instance}-${instance.state}`}
                                            instance={instance}
                                            enabled
                                            selected={deviceUtils.isSelectedInstance(
                                                selectedDevice,
                                                instance,
                                            )}
                                            selectDeviceInstance={selectDeviceInstance}
                                            index={index}
                                        />
                                    ))}
                                </InstancesWrapper>

                                <AddWalletButton
                                    device={device}
                                    instances={instances}
                                    addDeviceInstance={addDeviceInstance}
                                    selectDeviceInstance={selectDeviceInstance}
                                />
                            </WalletsWrapper>
                        </motion.div>
                    )}
                </AnimatePresence>
            )}
        </DeviceWrapper>
    );
};
