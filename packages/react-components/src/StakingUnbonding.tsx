// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress, DeriveStakingAccount } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { DarwiniaStakingStructsStakingLedger } from '@polkadot/react-components/types';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BlockNumber } from '@polkadot/types/interfaces';
import { BN, BN_ONE, BN_ZERO, formatBalance, formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';
import { useTranslation } from './translate';

interface Unlocking {
  remainingEras: BN;
  value: BN;
}

interface DeriveStakingAccountPartial {
  accountId: DeriveStakingAccount['accountId'] | string;
  unlocking?: Unlocking[];
  stakingLedger?: DarwiniaStakingStructsStakingLedger;
}

interface Props {
  iconPosition?: 'left' | 'right';
  className?: string;
  stakingInfo?: DeriveStakingAccountPartial;
}

function extractTotals (currentBlock?: BlockNumber, stakingInfo?: DeriveStakingAccountPartial, progress?: DeriveSessionProgress, isDarwinia = false): [[Unlocking, BN, BN][], BN] {
  if (isDarwinia) {
    if (!stakingInfo?.stakingLedger || !progress || !currentBlock) {
      return [[], BN_ZERO];
    }

    const stakingLedger = stakingInfo.stakingLedger;
    const unbondingItems = stakingLedger.ringStakingLock.unbondings.filter((unbondingItem) => unbondingItem.until.gt(currentBlock));
    const unbondingAmount = unbondingItems.reduce((accumulator, item) => accumulator.add(item.amount), new BN(0));
    const mapped = unbondingItems.map((item): [Unlocking, BN, BN] => {
      const blocksPerEra = progress.eraLength;
      const remainedBlocks = item.until.sub(currentBlock);
      const remainedEras = remainedBlocks.div(blocksPerEra);

      return [
        {
          remainingEras: remainedEras,
          value: item.amount
        },
        remainedEras,
        remainedBlocks
      ];
    });

    return [mapped, unbondingAmount];
  }

  if (!stakingInfo?.unlocking || !progress) {
    return [[], BN_ZERO];
  }

  const mapped = stakingInfo.unlocking
    .filter(({ remainingEras, value }) => value.gt(BN_ZERO) && remainingEras.gt(BN_ZERO))
    .map((unlock): [Unlocking, BN, BN] => [
      unlock,
      unlock.remainingEras,
      unlock.remainingEras
        .sub(BN_ONE)
        .imul(progress.eraLength)
        .iadd(progress.eraLength)
        .isub(progress.eraProgress)
    ]);
  const total = mapped.reduce((total, [{ value }]) => total.iadd(value), new BN(0));

  return [mapped, total];
}

function StakingUnbonding ({ className = '', iconPosition = 'left', stakingInfo }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const progress = useCall<DeriveSessionProgress>(api.derive.session.progress);
  const currentBlock = useBestNumber();
  const { t } = useTranslation();
  const isDarwinia = rpcNetwork.isDarwinia();

  const [mapped, total] = useMemo(
    () => extractTotals(currentBlock, stakingInfo, progress, isDarwinia),
    [currentBlock, isDarwinia, progress, stakingInfo]
  );

  if (!stakingInfo || !mapped.length) {
    return null;
  }

  const trigger = `${stakingInfo.accountId.toString()}-unlocking-trigger`;

  return (
    <StyledDiv className={className}>
      {iconPosition === 'left' && (
        <Icon
          className='left'
          icon='clock'
          tooltip={trigger}
        />
      )}
      <FormatBalance value={total} />
      <Tooltip trigger={trigger}>
        {mapped.map(([{ value }, eras, blocks], index): React.ReactNode => (
          <div
            className='row'
            key={index}
          >
            <div>{t<string>('Unbonding {{value}}', { replace: { value: formatBalance(value, { forceUnit: '-' }) } })}</div>
            <div className='faded'>
              {api.consts.babe?.epochDuration
                ? (
                  <BlockToTime
                    label={`${t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(blocks) } })}, `}
                    value={blocks}
                  />
                )
                : t<string>('{{eras}} eras remaining', { replace: { eras: formatNumber(eras) } })
              }
            </div>
          </div>
        ))}
      </Tooltip>
      {iconPosition === 'right' && (
        <Icon
          className='right'
          icon='clock'
          tooltip={trigger}
        />
      )}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  white-space: nowrap;

  .ui--Icon.left {
    margin-left: 0;
    margin-right: 0.25rem;
  }

  .ui--Icon.right {
    margin-left: 0.25rem;
    margin-right: 0;
  }

  .ui--FormatBalance {
    display: inline-block;
  }
`;

export default React.memo(StakingUnbonding);
