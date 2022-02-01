// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { SlashingSpans } from '@polkadot/types/interfaces';

import React from 'react';

import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from './translate';
import TxButton from './TxButton';

interface Props {
  className?: string;
  stakingInfo?: DeriveStakingAccount;
}

const transformSpan = {
  transform: (optSpans: Option<SlashingSpans>): number =>
    optSpans.isNone
      ? 0
      : optSpans.unwrap().prior.length + 1
};

function StakingRedeemable ({ className = '', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const spanCount = useCall<number>(api.query.staking.slashingSpans, [stakingInfo?.stashId], transformSpan);

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
                api.tx.staking.withdrawUnbonded.meta.args.length === 1
                  ? [spanCount]
                  : []
              }
              tooltip={t<string>('Withdraw these unbonded funds')}
              tx={api.tx.staking.withdrawUnbonded}
            />
          )
          : <span className='icon-void'>&nbsp;</span>}
      </FormatBalance>
    </div>
  );
}

export default React.memo(StakingRedeemable);
