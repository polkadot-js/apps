// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import Banner from '@polkadot/app-accounts/Accounts/Banner';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  minBond?: BN;
  stakingInfo?: DeriveStakingAccount;
}

function InfoBond ({ minBond, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const isBelow = useMemo(
    () => minBond && stakingInfo && stakingInfo.stakingLedger.active.unwrap().lt(minBond),
    [minBond, stakingInfo]
  );

  return isBelow
    ? <Banner>
      {t<string>('Your bonded amount is below the on-chain minimum threshold of {{minBond}}. If you would like to change the nominee, use nomination pools', { replace: { minBond: formatBalance(minBond) } })}
    </Banner>
    : null;
}

export default React.memo(InfoBond);
