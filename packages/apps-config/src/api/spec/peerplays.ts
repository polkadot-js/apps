// Copyright 2017-2024 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OverrideBundleDefinition } from '@polkadot/types/types';

// structs need to be in order
/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    validatormanager: {
      activeValidators: {
        description: 'Get the list of active validators',
        params: [],
        type: 'Vec<AccountId>',
        jsonrpc: 'validatormanager_activeValidators',
        method: 'activeValidators',
        section: 'validatormanager'
      },
      currentMaintenanceIndex: {
        description: 'Get current maintenance index',
        params: [],
        type: 'MaintenanceIndex',
        jsonrpc: 'validatormanager_currentMaintenanceIndex',
        method: 'currentMaintenanceIndex',
        section: 'validatormanager'
      },
      nextMaintenanceIndex: {
        description: 'Get next maintenance index',
        params: [],
        type: 'MaintenanceIndex',
        jsonrpc: 'validatormanager_nextMaintenanceIndex',
        method: 'nextMaintenanceIndex',
        section: 'validatormanager'
      },
      offenceValidators: {
        description: 'Get the list of active validators who made the offence',
        params: [],
        type: 'Vec<(AccountId, AuthIndex)>',
        jsonrpc: 'validatormanager_offenceValidators',
        method: 'offenceValidators',
        section: 'validatormanager'
      },
      offlineValidators: {
        description: 'Get the list of active validators who went offline',
        params: [],
        type: 'Vec<(AccountId, AuthIndex)>',
        jsonrpc: 'validatormanager_offlineValidators',
        method: 'offlineValidators',
        section: 'validatormanager'
      },
      validatorsPool: {
        description: 'Get the list of validator candidates',
        params: [],
        type: 'Vec<AccountId>',
        jsonrpc: 'validatormanager_validatorsPool',
        method: 'validatorsPool',
        section: 'validatormanager'
      }
    }
  },
  types: [
    {
      minmax: [0, undefined],
      types: {
        AccountId: 'EthereumAccountId',
        AccountId20: 'EthereumAccountId',
        AccountId32: 'EthereumAccountId',
        Address: 'AccountId',
        AuthIndex: 'u32',
        EthereumSignature: {
          r: 'H256',
          s: 'H256',
          v: 'U8'
        },
        ExtrinsicSignature: 'EthereumSignature',
        Lookup0: 'AccountId',
        LookupSource: 'AccountId',
        MaintenanceIndex: 'u32'
      }
    }
  ]
};

export default definitions;
