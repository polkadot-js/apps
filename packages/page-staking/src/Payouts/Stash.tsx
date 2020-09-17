// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { DeriveStakerReward, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { PayoutStash } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import ApiPromise from '@polkadot/api/promise';
import { AddressSmall, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import { createErasString } from './util';
import useEraBlocks from './useEraBlocks';

interface Props {
  className?: string;
  isDisabled?: boolean;
  payout: PayoutStash;
  stakerPayoutsAfter: BN;
}

interface EraInfo {
  eraStr: React.ReactNode;
  oldestEra?: BN;
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

function Stash ({ className = '', isDisabled, payout: { available, rewards, stashId }, stakerPayoutsAfter }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [{ eraStr, oldestEra }, setEraInfo] = useState<EraInfo>({ eraStr: '' });
  const eraBlocks = useEraBlocks(oldestEra);
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account, [stashId]);

  useEffect((): void => {
    rewards && setEraInfo({
      eraStr: createErasString(rewards.map(({ era }): BN => era)),
      oldestEra: rewards[0]?.era
    });
  }, [rewards]);

  useEffect((): void => {
    if (rewards) {
      const available = rewards.filter(({ era }) => era.lt(stakerPayoutsAfter));

      setExtrinsic(
        api.tx.utility && available.length
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
      <td
        className='address'
        colSpan={2}
      >
        <AddressSmall value={stashId} />
      </td>
      <td className='start'>
        <span className='payout-eras'>{eraStr}</span>
      </td>
      <td className='number'><FormatBalance value={available} /></td>
      <td className='number'>{eraBlocks && <BlockToTime blocks={eraBlocks} />}</td>
      <td
        className='button'
        colSpan={3}
      >
        {extrinsic && stakingAccount && (
          <TxButton
            accountId={stakingAccount.controllerId}
            extrinsic={extrinsic}
            icon='credit-card'
            isDisabled={!extrinsic || isDisabled}
            label={t<string>('Payout')}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Stash);
