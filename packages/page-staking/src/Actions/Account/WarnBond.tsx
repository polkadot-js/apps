// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveStakingAccount } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';

import { MarkWarning } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  minBond?: BN;
  stakingInfo?: DeriveStakingAccount;
}

function WarnBond ({ minBond, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  const isBelow = useMemo(
    () => minBond && stakingInfo && stakingInfo.stakingLedger.active.unwrap().lt(minBond),
    [minBond, stakingInfo]
  );

  return isBelow
    ? <MarkWarning content={t<string>('Your bonded amount is below the on-chain minimum threshold of {{minBond}} and may be chilled. Bond extra funds to increase the bonded amount.', { replace: { minBond: formatBalance(minBond) } })} />
    : null;
}

export default React.memo(WarnBond);
