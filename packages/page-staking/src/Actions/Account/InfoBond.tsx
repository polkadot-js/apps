// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import Icon from '@polkadot/react-components/Icon';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../../translate.js';

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
    ? <article className={'mark'}>
      <Icon icon='circle-info' />
      {t<string>('Your bonded amount is below the on-chain minimum threshold of {{minBond}} for direct validator nomination. If you would like to change the nominee, use nomination pools where that threshold is lower.', { replace: { minBond: formatBalance(minBond) } })}
    </article>
    : null;
}

export default React.memo(InfoBond);
