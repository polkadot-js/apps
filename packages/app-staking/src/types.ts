// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances, DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';
import { SessionRewards } from '@polkadot/react-hooks/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

export type Nominators = Record<string, string[]>;

export interface ComponentProps {
  allAccounts?: SubjectInfo;
  allControllers: string[];
  allStashes: string[];
  bestNumber?: BlockNumber;
  className?: string;
  recentlyOnline?: DerivedHeartbeats;
  stakingRewards: SessionRewards[];
  stakingOverview?: DerivedStakingOverview;
}

export interface CalculateBalanceProps {
  balances_fees?: DerivedFees;
  balances_all?: DerivedBalances;
}

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';
