// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        Attestation: {
          attester: 'AccountId',
          ctypeHash: 'Hash',
          delegationId: 'Option<DelegationNodeId>',
          revoked: 'bool'
        },
        Balance: 'u128',
        DelegationNode: {
          owner: 'AccountId',
          parent: 'Option<DelegationNodeId>',
          permissions: 'Permissions',
          revoked: 'bool',
          rootId: 'DelegationNodeId'
        },
        DelegationNodeId: 'Hash',
        DelegationRoot: {
          ctypeHash: 'Hash',
          owner: 'AccountId',
          revoked: 'bool'
        },
        DidRecord: {
          boxKey: 'Hash',
          docRef: 'Option<Vec<u8>>',
          signKey: 'Hash'
        },
        Index: 'u64',
        Permissions: 'u32',
        PublicBoxKey: 'Hash',
        PublicSigningKey: 'Hash',
        Signature: 'MultiSignature',
        XCurrencyId: {
          chainId: 'ChainId',
          currencyId: 'Vec<u8>'
        },
        ChainId: {
          _enum: {
            RelayChain: 'Null',
            ParaChain: 'ParaId'
          }
        },
        CurrencyIdOf: 'CurrencyId',
        CurrencyId: {
          _enum: {
            DOT: 0,
            KSM: 1,
            KILT: 2
          }
        },
        XcmError: {
          _enum: {
            Undefined: 0,
            Unimplemented: 1,
            UnhandledXcmVersion: 2,
            UnhandledXcmMessage: 3,
            UnhandledEffect: 4,
            EscalationOfPrivilege: 5,
            UntrustedReserveLocation: 6,
            UntrustedTeleportLocation: 7,
            DestinationBufferOverflow: 8,
            CannotReachDestination: 9,
            MultiLocationFull: 10,
            FailedToDecode: 11,
            BadOrigin: 12,
            ExceedsMaxMessageSize: 13,
            FailedToTransactAsset: 14
          }
        },
        ReferendumInfo: {
          _enum: {
            Ongoing: 'ReferendumStatus',
            Finished: 'ReferendumInfoFinished'
          }
        }
      }
    }
  ]
};

export default definitions;
