import { getWeakRandomId } from '@trezor/utils';

import * as coordinator from '../coordinator';
import * as middleware from '../middleware';
import { outputDecomposition } from './outputDecomposition';
import type { Account } from '../Account';
import type { Alice } from '../Alice';
import type { CoinjoinPrison } from '../CoinjoinPrison';
import type { CoinjoinRound, CoinjoinRoundOptions } from '../CoinjoinRound';
import type { AccountAddress } from '../../types';

/**
 * RoundPhase: 2, OutputRegistration
 *
 * Process steps:
 * - Calculate output amounts using middleware (see ./outputDecomposition)
 * - Combine registered Credentials in to outputs using coordinator /credential-issuance (see ./outputDecomposition)
 * - Register decomposed Credentials as outputs using coordinator /output-registration
 * - Finally call /ready-to-sign on coordinator for each input
 */

const registerOutput = async (
    round: CoinjoinRound,
    outputAddress: AccountAddress[],
    amountCredentials: middleware.Credentials[],
    vsizeCredentials: middleware.Credentials[],
    prison: CoinjoinPrison,
    options: CoinjoinRoundOptions,
) => {
    const { roundParameters } = round;
    const { signal, coordinatorUrl, middlewareUrl } = options;

    const outputAmountCredentials = await middleware.getRealCredentials(
        [0, 0],
        amountCredentials,
        round.amountCredentialIssuerParameters,
        roundParameters.maxAmountCredentialValue,
        { signal, baseUrl: middlewareUrl },
    );
    const outputVsizeCredentials = await middleware.getRealCredentials(
        [0, 0],
        vsizeCredentials,
        round.vsizeCredentialIssuerParameters,
        roundParameters.maxVsizeCredentialValue,
        { signal, baseUrl: middlewareUrl },
    );

    // TODO: tricky, if for some reason AlreadyRegisteredScript is called then we have 2 options:
    // - try again with different address and link my new address with old address (privacy loss against coordinator?)
    // - intentionally stop output registrations for all other credentials. Question: which input will be banned if i call readyToSign on each anyway? is it better to break here and not to proceed to signing?
    const tryToRegisterOutput = (): Promise<AccountAddress> => {
        const address = outputAddress.find(a => !prison.isDetained(a.scriptPubKey));
        if (!address) {
            throw new Error('No change address available');
        }

        return coordinator
            .outputRegistration(
                round.id,
                address,
                outputAmountCredentials,
                outputVsizeCredentials,
                {
                    signal,
                    baseUrl: coordinatorUrl,
                    identity: getWeakRandomId(10),
                    deadline: round.phaseDeadline,
                },
            )
            .then(() => address)
            .catch(error => {
                if (
                    error.message === coordinator.WabiSabiProtocolErrorCode.AlreadyRegisteredScript
                ) {
                    prison.detain(address.scriptPubKey, {
                        roundId: round.id,
                        reason: error.message,
                    });
                    return tryToRegisterOutput();
                }
                throw error;
            });
    };

    const address = await tryToRegisterOutput();
    prison.detain(address.scriptPubKey, {
        roundId: round.id,
        reason: coordinator.WabiSabiProtocolErrorCode.AlreadyRegisteredScript,
    });

    return {
        address,
    };
};

// TODO: delay
const readyToSign = (
    round: CoinjoinRound,
    input: Alice,
    { signal, coordinatorUrl }: CoinjoinRoundOptions,
) =>
    coordinator.readyToSign(round.id, input.registrationData!.aliceId, {
        signal,
        baseUrl: coordinatorUrl,
        identity: input.outpoint, // NOTE: recycle input identity
        delay: 0,
        deadline: round.phaseDeadline,
    });

export const outputRegistration = async (
    round: CoinjoinRound,
    accounts: Account[],
    prison: CoinjoinPrison,
    options: CoinjoinRoundOptions,
) => {
    // TODO:
    // - decide if there is only 1 account registered should i abaddon this round and blame it on some "youngest" input?
    // - maybe if there is only 1 account inputs are so "far away" from each other that it is wort to mix anyway?
    try {
        // decompose output amounts for all registered inputs grouped by Account
        const decomposedGroup = await outputDecomposition(round, options);

        // collect all used addresses
        // try to register outputs for each account (each input in account group)
        for (let group = 0; group < decomposedGroup.length; group++) {
            const { accountKey, outputs } = decomposedGroup[group];
            const account = accounts.find(a => a.accountKey === accountKey);
            if (!account) throw new Error(`Unknown account ~~${accountKey}~~`);
            const { changeAddresses } = account;
            for (let index = 0; index < outputs.length; index++) {
                // TODO: no not proceed if one of output fails (do not sign!!)
                // eslint-disable-next-line no-await-in-loop
                const result = await registerOutput(
                    round,
                    changeAddresses,
                    outputs[index].amountCredentials,
                    outputs[index].vsizeCredentials,
                    prison,
                    options,
                );
                round.addresses.push(result.address);
            }
        }

        // inform coordinator that each registered input is ready to sign
        await Promise.all(round.inputs.map(input => readyToSign(round, input, options)));
        options.log(`Ready to sign ~~${round.id}~~`);
    } catch (error) {
        // NOTE: if anything goes wrong in this process this Round will be corrupted for all the users
        // registered inputs will probably be banned
        const message = `Output registration in ~~${round.id}~~ failed: ${error.message}`;
        options.log(message);

        round.inputs.forEach(input => input.setError(new Error(message)));
    }
    return round;
};
