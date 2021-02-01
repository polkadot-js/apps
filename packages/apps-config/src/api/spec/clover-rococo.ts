// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * types for clover
 **/
const cloverRococoTypes = {
  Amount: 'i128',
  AmountOf: 'Amount',
  Balance: 'u128',
  CurrencyId: {
    _enum: ['CLV', 'CUSDT', 'DOT', 'CETH']
  },
  CurrencyIdOf: 'CurrencyId',
  CurrencyInfo: {
    id: 'CurrencyId',
    name: 'CurrencyTypeEnum'
  },
  CurrencyTypeEnum: {
    _enum: ['CLV', 'CUSDT', 'DOT', 'CETH']
  },
  EcdsaSignature: '[u8; 65]',
  EvmAddress: 'H160',
  ExchangeInfo: {
    balance: 'Balance',
    routes: 'Vec<CurrencyTypeEnum>'
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
  },
  ExitRevert: {
    _enum: ['Reverted']
  },
  ExitSucceed: {
    _enum: ['Stopped', 'Returned', 'Suicided']
  },
  OracleKey: 'CurrencyId',
  PairKey: 'u64',
  PoolId: {
    _enum: {
      Swap: 'u64'
    }
  },
  Price: 'FixedU128',
  Rate: 'FixedU128',
  Ratio: 'FixedU128',
  Share: 'u128'
};

export default cloverRococoTypes;
