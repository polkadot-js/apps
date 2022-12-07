// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { MarkWarning } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option, u8 } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  minBond?: BN;
  stakingInfo?: DeriveStakingAccount;
}

function WarnBond ({ minBond, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();

  const chillThreshold = useCall<Option<u8>>(api.query.staking.chillThreshold);

  const isBelow = useMemo(
    () => chillThreshold && chillThreshold.isSome && minBond && stakingInfo && stakingInfo.stakingLedger.active.unwrap().lt(minBond),
    [minBond, stakingInfo, chillThreshold]
  );

  return isBelow
    ? <MarkWarning content={t<string>('Your bonded amount is below the on-chain minimum threshold of {{minBond}} and may be chilled. Bond extra funds to increase the bonded amount.', { replace: { minBond: formatBalance(minBond) } })} />
    : null;
}

export default React.memo(WarnBond);
