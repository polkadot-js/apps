// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances, DerivedHeartbeats } from '@polkadot/api-derive/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { EraPoints } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export type Nominators = Record<string, string[]>;

export interface ComponentProps {
  allAccounts?: SubjectInfo;
  allControllers: string[];
  allStashes: string[];
  currentValidators: string[];
  eraPoints?: EraPoints;
  recentlyOnline?: DerivedHeartbeats;
}

export interface CalculateBalanceProps {
  balances_fees?: DerivedFees;
  balances_all?: DerivedBalances;
  system_accountNonce?: BN;
}

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated';
