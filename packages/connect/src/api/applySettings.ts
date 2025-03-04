// origin: https://github.com/trezor/connect/blob/develop/src/js/core/methods/ApplySettings.js

import { AbstractMethod } from '../core/AbstractMethod';
import { PROTO } from '../constants';
import { Assert } from '@trezor/schema-utils';
import { ApplySettings as ApplySettingsSchema } from '../types/api/applySettings';

export default class ApplySettings extends AbstractMethod<'applySettings', PROTO.ApplySettings> {
    init() {
        this.requiredPermissions = ['management'];
        this.useDeviceState = false;
        const { payload } = this;

        Assert(ApplySettingsSchema, payload);

        this.params = {
            language: payload.language,
            label: payload.label,
            use_passphrase: payload.use_passphrase,
            homescreen: payload.homescreen,
            passphrase_always_on_device: payload.passphrase_always_on_device,
            auto_lock_delay_ms: payload.auto_lock_delay_ms,
            display_rotation: payload.display_rotation,
            safety_checks: payload.safety_checks,
            experimental_features: payload.experimental_features,
            _passphrase_source: payload.passphrase_source,
        };
    }

    get confirmation() {
        return {
            view: 'device-management' as const,
            customConfirmButton: {
                className: 'confirm',
                label: 'Proceed',
            },
            label: 'Do you really want to change device settings?',
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const response = await cmd.typedCall('ApplySettings', 'Success', this.params);

        return response.message;
    }
}
