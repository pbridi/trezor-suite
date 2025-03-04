# 1.1.28

-   chore(protobuf): ability to build protobuf messages from the specified branch (7a6babb818)
-   fix(transport): remove accidental descriptors object mutation (3cd6b820f9)
-   Revert feat(transport): add scheduleActionParams to call api (4de6cbed0c)
-   feat(transport): add scheduleActionParams to call api (40a053013a)
-   feat(protocol): separate chunking from encoding (2f445ba734)
-   chore(transport): drop dead code (faba718c9f)
-   chore(protocol): rename decode response fields (1db2916fed)
-   test(transport): fix e2e triggering unit tests (9c117de07e)
-   feat(transport): handle cases when bridge returns descriptor with same path but different product (e2abb91fc8)
-   chore(transport): improve tests setup (5aa27a0fba)
-   chore(transport): keep track of full descriptors in background (be400968bb)
-   feat(transport): add field type to descriptor (74a7214adb)
-   test(suite-native): detox e2e (#11821) (3e3f185ece)

# 1.1.27

-   chore(ci): faster transport E2E (5154075030)
-   fix(transport): accept logger also for usb transports (3a5dee1318)
-   chore: TS project references for build:libs + buildless utxo-lib (#11526) (4d857722fe)
-   fix(connect): fix connect for RN (#11489) (14814fd54b)
-   chore(repo): mostly buildless monorepo (#11464) (637ad88dcf)

# 1.1.26

-   chore(transport, trezor-user-env-link): remove cross-fetch (e489dce33)

# 1.1.25

-   fix: from g:tsx to local tsx in prepublish script (d21d698b2)
-   chore(suite): autofix newlines (c82455e74)
-   chore(utils): remove build step requirement from @trezor/utils (#11176) (6cd3d3c81)
-   feat(connect): add support for StellarClaimClaimableBalanceOp. (51a3e294d)
-   chore(repo): ESLint refactor + speed up 70% (#11143) (44fa12a79)
-   chore: update various dependencies (no major update) (fecd89f6e)
-   chore: use global tsx (c21d81f66)
-   chore: update typescript and use global tsc (84bc9b8bd)
-   chore: use global rimraf (5a6759eff)
-   chore: update prettier (00fe229e0)
-   chore: upgrade jest to 29.7.0 (3c656dc0b)
-   chore: upgrade jest (004938e24)
-   chore: update root dependencies (fac6d99ec)
-   chore: updated deprecated jest syntax (d3f8043f0)

# 1.1.21

-   chore(transport): remove unused files (b69076a80)
-   chore(transport): remove custom eslint no-underscore-dangle rule (049e42d18)
-   chore(transport): remove custom eslint no-await-in-loop rule (be90dcd2a)
-   chore(transport): remove custom eslint no-restricted-syntax rule (8b4910209)
-   chore(transport): remove custom eslint ban-types rule (44da16615)
-   fix(transport): add missing await (aaecf9440)
-   chore(transport): move node-bridge logic to transport-bridge package (0f2882af4)
-   fix(mobile): fix Cardano receive (#10580) (3c5e253e0)
-   feat(transport): add node-bridge module (acf5056f7)
-   chore(transport): separate receive util (d1d964c1d)
-   fix(connect): check custom Transport instance (018ef646d)

# 1.1.19

-   chore: remove `bytebuffer` dependency (9b2f9def0)
-   chore(connect): use `tslib` as dependency in all public libs (606ecc63b)
-   chore: update `jest` and related dependency (b8a321c83)
-   feat(transport): allow custom chunkSize in protocol-v1.encode (ba855c980)
-   feat(transport): accept encoding protocols as parameter of send, receive and call methods (b64af958e)
-   feat(transport): unify protocol encode/decode functions (b4f08409c)
-   chore(repo): update tsx (53de3e3a8)
-   tests: switch to fw main branch (91c450631)

# 1.1.18

-   chore(repo): Upgrade TS 5.3 (#10017) (7277f9d0f)
-   chore(repo): upgrade to TS 5.2 (#9989) (bf8d0fe80)
-   refactor(transport): rename files (f5286f613)
-   chore(tests): cleanup jets configs (#9869) (7b68bab05)
-   feat(deps): update deps without breaking changes (7e0584c51)
-   tests(transport): check presence of protobuf messages (60f1a8bf1)
-   feat(transport): do not require protobuf messages (221573be2)
-   tests(transport): fix type-check (ffcfde3bb)
-   tests(transport): fix imports in e2e (1ffb1c05b)
-   tests(transport): remove unused script/test (6feadb573)
-   chore(desktop): update deps related to desktop packages (af412cfb5)
-   feat(mobile): create react-native-usb library (#9689) (3be5f5015)

# 1.1.17

-   chore: edit links to trezor-firmware repo after renaming its main branch (2b0606371)
-   fix: content type header applied for native (#9594) (c84270e13)
-   fix: use type header with the bridge API (#9590) (b8bb2dfe6)

# 1.1.16

-   feat(transport): udp support (65e617195)
-   chore: adjust/unify createDeferred usage (4d724a451)

# 1.1.15

-   chore(transport): merge lowlevel folder with utils (1d8d76637)
-   chore(transport): reorganize protocol related logic (cbabe2e2c)
-   refactor(transport): small change in interface device type (fb73caa39)
-   chore: introduce protobuf and protocol packages (072042e77)

# 1.1.14

-   chore(deps): bump protobufjs from 6.11.3 to 7.2.4 (d0cb6caae)
-   fix(transport): fix occasional race condition (fb8062e18)
-   feat(transport): internal_model enum (26c17386a)

# 1.1.13

-   test(transport): extend unit tests (99e12c7be)
-   fix(transport): race condition in listen (6cd72cb60)
-   chore(transport): update messages (7bc259f8b)
-   feat(transport): add nodeusb transport (f0cee52f2)
-   chore(deps): update (a21a081ba)
-   chore(transport): reuse typed event emitter from utils (379c82dd3)
-   chore(request-manager,transport,connect-plugin-stelar): fix extraneous dependencies (68bf1d451)
-   chore(transport): refactor (f7b97fb68)

# 1.1.11

-   819c019d1 chore: use workspace:\* everywhere

# 1.1.10

-   fix(transport): update encoded_network to ArrayBuffer
-   chore(transport): protobuf patch for ethereum get address

# 1.1.9

chore(transport): update protobufs, update dependencies

# 1.1.8

-   chore(connect;transport): connect.init add transports param; rename transports

# 1.1.7

-   Code cleanup, sharing constants with @trezor/connect

# 1.1.6

-   Dependencies: typescript 4.9

# 1.1.5

-   Removed flowtype generation
-   Added CoinJoinRequest message
-   Cardano: Added support for [CIP36](https://cips.cardano.org/cips/cip36/) Catalyst registration format

# 1.1.4

-   Added cardano types related to [babbage feature](https://github.com/trezor/trezor-suite/commit/efe9c78a2f74a1b7653b3fddf6cca35ba38d3ae9#diff-c1b9d6a93a3b65c45c4dcf06aa86d6c7a84bcc2e14fefdc4a9bdc3d3298c9a5a)

# 1.1.2

-   Added CardanoTxRequiredSigner.key_path': 'optional in protobuf patches

# 1.1.1

-   Changed latest bridge url to https://connect.trezor.io/8/data/bridge/latest.txt'
-   Added trezor-common submodule. Protobuf definitions (messages.json) and protobuf related typescript definitions.

# 1.1.0

-   Added @trezor/utils dependency.

# 1.0.1

-   Fixed: encoding protobuf messages containing numbers over Number.MAX_SAFE_INTEGER in browser environment.

# 1.0.0

-   first release
