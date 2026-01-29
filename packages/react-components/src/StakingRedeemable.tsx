// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React from 'react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from './translate.js';
import TxButton from './TxButton.js';

interface DeriveStakingAccountPartial {
  controllerId: DeriveStakingAccount['controllerId'] | string;
  stashId: DeriveStakingAccount['stashId'] | string;
  redeemable?: BN;
}

interface Props {
  className?: string;
  isPool?: boolean;
  stakingInfo?: DeriveStakingAccountPartial;
}

const OPT_SPAN = {
  transform: (optSpans: Option<SlashingSpans>): number =>
    optSpans.isNone
      ? 0
      : optSpans.unwrap().prior.length + 1
};

function StakingRedeemable ({ className = '', isPool, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const spanCount = useCall<number>(api.query.staking.slashingSpans, [stakingInfo?.stashId], OPT_SPAN);

  if (!stakingInfo?.redeemable?.gtn(0)) {
    return null;
  }

  return (
    <div className={className}>
      <FormatBalance value={stakingInfo.redeemable}>
        {allAccounts.includes((stakingInfo.controllerId || '').toString())
          ? (
            <TxButton
              accountId={stakingInfo.controllerId}
              icon='lock'
              isIcon
              key='unlock'
              params={
                isPool
                  ? [stakingInfo.controllerId, spanCount]
                  : api.tx.staking.withdrawUnbonded.meta.args.length === 1
                    ? [spanCount]
                    : []
              }
              tooltip={t('Withdraw these unbonded funds')}
              tx={
                isPool
                  ? api.tx.nominationPools.withdrawUnbonded
                  : api.tx.staking.withdrawUnbonded}
            />
          )
          : <span className='icon-void'>&nbsp;</span>}
      </FormatBalance>
    </div>
  );
}

export default React.memo(StakingRedeemable);
