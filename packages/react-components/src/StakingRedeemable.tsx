// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { BlockNumber, SlashingSpans } from '@polkadot/types/interfaces';

import React from 'react';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { DarwiniaStakingStructsStakingLedger } from '@polkadot/react-components/types';
import { useAccounts, useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import { BN } from '@polkadot/util';

import { useTranslation } from './translate';
import TxButton from './TxButton';

interface DeriveStakingAccountPartial {
  controllerId: DeriveStakingAccount['controllerId'] | string;
  stashId: DeriveStakingAccount['stashId'] | string;
  redeemable?: BN;
  stakingLedger?: PalletStakingStakingLedger | DarwiniaStakingStructsStakingLedger;
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

const getDarwiniaRedeemableBalance = (stakingLedger: DarwiniaStakingStructsStakingLedger, bestNumber: BlockNumber): BN => {
  const unbonded = stakingLedger.ringStakingLock.unbondings.filter((item) => bestNumber.gte(item.until));

  return unbonded.reduce((accumulator, item) => accumulator.add(item.amount), new BN(0));
};

function StakingRedeemable ({ className = '', isPool, stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { t } = useTranslation();
  const spanCount = useCall<number>(api.query.staking.slashingSpans, [stakingInfo?.stashId], OPT_SPAN);
  const isDarwinia = rpcNetwork.isDarwinia();
  const bestNumber = useBestNumber();

  if (isDarwinia && stakingInfo && stakingInfo.stakingLedger && bestNumber) {
    stakingInfo.redeemable = getDarwiniaRedeemableBalance(stakingInfo.stakingLedger as DarwiniaStakingStructsStakingLedger, bestNumber);
  }

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
              tooltip={t<string>('Withdraw these unbonded funds')}
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
