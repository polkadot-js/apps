// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

export default {
  Address: 'GenericAddress',
  Difficulty: 'U256',
  DifficultyAndTimestamp: {
    difficulty: 'Difficulty',
    timestamp: 'Moment'
  },
  // previous substrate versions
  BalanceLock: 'BalanceLockTo212',
  DispatchError: 'DispatchErrorTo198',
  DispatchResult: 'DispatchResultTo198',
  DispatchInfo: {
    weight: 'Weight',
    class: 'DispatchClass'
  },
  ReferendumInfo: 'ReferendumInfoTo239',
  StakingLedger: 'StakingLedgerTo223'
};
