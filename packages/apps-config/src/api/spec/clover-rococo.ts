// Copyright 2017-2025 @polkadot/apps-config authors & contributors
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
        Amount: 'i128',
        AmountOf: 'Amount',
        Balance: 'u128',
        CurrencyId: {
          _enum: ['CLV', 'CUSDT', 'DOT', 'CETH']
        },
        CurrencyIdOf: 'CurrencyId',
        CurrencyTypeEnum: {
          _enum: ['CLV', 'CUSDT', 'DOT', 'CETH']
        },
        PairKey: 'u64',
        Rate: 'FixedU128',
        Ratio: 'FixedU128',
        Price: 'FixedU128',
        Share: 'u128',
        OracleKey: 'CurrencyId',
        CurrencyInfo: {
          id: 'CurrencyId',
          name: 'CurrencyTypeEnum'
        },
        ExchangeInfo: {
          balance: 'Balance',
          routes: 'Vec<CurrencyTypeEnum>'
        },
        PoolId: {
          _enum: {
            Swap: 'u64'
          }
        },
        EcdsaSignature: '[u8; 65]',
        EvmAddress: 'H160',
        ExitSucceed: {
          _enum: ['Stopped', 'Returned', 'Suicided']
        },
        ExitRevert: {
          _enum: ['Reverted']
        },
        ExitError: {
          _enum: [
            'StackUnderflow', 'StackOverflow', 'InvalidJump', 'InvalidRange', 'DesignatedInvalid', 'CallTooDeep',
            'CreateCollision', 'CreateContractLimit', 'OutOfOffset', 'OutOfGas', 'OutOfFund', 'PCUnderflow', 'CreateEmpty',
            'Other<String>'
          ]
        },
        ExitFatal: {
          _enum: ['NotSupported', 'UnhandledInterrupt', 'CallErrorAsFatal', 'Other<String>']
        },
        ExitReason: {
          _enum: ['Succeed<ExitSucceed>',
            'Error<ExitError>',
            'Revert<ExitRevert>',
            'Fatal<ExitFatal>'
          ]
        }
      }
    }
  ]
};

export default definitions;
