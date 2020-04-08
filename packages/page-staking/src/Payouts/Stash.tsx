// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveStakerReward, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { PayoutStash } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { AddressMini, Badge, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import { createErasString } from './util';

interface Props {
  className?: string;
  isInElection?: boolean;
  payout: PayoutStash;
  stakerPayoutsAfter: BN;
}

function createPrevPayoutType (api: ApiPromise, { era, isValidator, nominating }: DeriveStakerReward): SubmittableExtrinsic<'promise'> {
  return isValidator
    ? api.tx.staking.payoutValidator(era)
    : api.tx.staking.payoutNominator(era, nominating.map(({ validatorId, validatorIndex }): [string, number] =>
      [validatorId, validatorIndex]
    ));
}

function createPrevPayout (api: ApiPromise, payoutRewards: DeriveStakerReward[]): SubmittableExtrinsic<'promise'> {
  return payoutRewards.length === 1
    ? createPrevPayoutType(api, payoutRewards[0])
    : api.tx.utility.batch(payoutRewards.map((reward) => createPrevPayoutType(api, reward)));
}

function Stash ({ className, isInElection, payout: { available, rewards, stashId }, stakerPayoutsAfter }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [eraStr, setEraStr] = useState('');
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account as any, [stashId]);

  useEffect((): void => {
    rewards && setEraStr(
      createErasString(rewards.map(({ era }): BN => era))
    );
  }, [rewards]);

  useEffect((): void => {
    if (rewards) {
      const available = rewards.filter(({ era }) => era.lt(stakerPayoutsAfter));

      setExtrinsic(
        available.length
          ? createPrevPayout(api, available)
          : null
      );
    }
  }, [api, rewards, stakerPayoutsAfter]);

  if (available.isZero()) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='address'><AddressMini value={stashId} /></td>
      <td className='start'>
        <Badge
          info={rewards.length}
          isInline
          type='counter'
        />
        <span className='payout-eras'>{eraStr}</span>
      </td>
      <td className='number'><FormatBalance value={available} /></td>
      <td
        className='button'
        colSpan={3}
      >
        {extrinsic && stakingAccount && (
          <TxButton
            accountId={stakingAccount.controllerId}
            extrinsic={extrinsic}
            icon='credit card outline'
            isDisabled={!extrinsic || isInElection}
            isPrimary={false}
            label={t('Payout')}
            withSpinner={false}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Stash);
