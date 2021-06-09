// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { DeriveStakerReward, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { PayoutStash } from './types';

import React, { useEffect, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { AddressSmall, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useTxBatch } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import useEraBlocks from './useEraBlocks';
import { createErasString } from './util';

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

// TODO This is pre Substrate 2.0, remove
function createPrevPayouts (api: ApiPromise, payoutRewards: DeriveStakerReward[]): SubmittableExtrinsic<'promise'>[] {
  return payoutRewards.map(({ era, isValidator, nominating }) =>
    isValidator
      ? api.tx.staking.payoutValidator(era)
      : api.tx.staking.payoutNominator(era, nominating.map(({ validatorId, validatorIndex }): [string, number] =>
        [validatorId, validatorIndex]
      ))
  );
}

function Stash ({ className = '', isDisabled, payout: { available, rewards, stashId }, stakerPayoutsAfter }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [payoutTxs, setPayoutTxs] = useState<SubmittableExtrinsic<'promise'>[]>([]);
  const batchTx = useTxBatch(payoutTxs);
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
    rewards && setPayoutTxs(
      createPrevPayouts(api, rewards.filter(({ era }) => era.lt(stakerPayoutsAfter)))
    );
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
      <td className='number'>{eraBlocks && <BlockToTime value={eraBlocks} />}</td>
      <td
        className='button'
        colSpan={3}
      >
        {batchTx && stakingAccount && (
          <TxButton
            accountId={stakingAccount.controllerId}
            extrinsic={batchTx}
            icon='credit-card'
            isDisabled={!batchTx || isDisabled}
            label={t<string>('Payout')}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Stash);
