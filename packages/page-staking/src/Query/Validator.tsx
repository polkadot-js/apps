// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { SessionRewards } from '../types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  sessionRewards: SessionRewards[];
  validatorId: string;
}

type LineDataEntry = (BN | number)[];

type LineData = LineDataEntry[];

interface BlockChart {
  blockChart: LineData;
  blockLabels: string[];
}

interface StakeChart {
  stakeChart: LineData;
  stakeLabels: string[];
}

// const COLORS_MINE = ['#ff8c00'];
// const COLORS_OTHER = ['#acacac'];
// const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];
const COLORS_BLOCKS = [undefined, '#acacac'];

function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}

function extractBlocks (validatorId: string, rewards: DeriveStakerReward[] = []): BlockChart {
  const blockLabels: string[] = [];
  const avgSet: number[] = [];
  const idxSet: number[] = [];
  let total = 0;

  rewards.forEach(({ era, validators }, index): void => {
    const points = validators[validatorId]?.points.toNumber() || 0;

    total += points;

    blockLabels.push(era.toHuman());
    avgSet.push(Math.ceil(total / (index + 1) * 100) / 100);
    idxSet.push(points);
  });

  return {
    blockChart: [idxSet, avgSet],
    blockLabels
  };
}

function extractStake (validatorId: string, divisor: BN, rewards: DeriveStakerReward[] = []): StakeChart {
  const stakeLabels: string[] = [];
  const stakeChart: LineDataEntry = [];

  rewards.forEach(({ era, validators }): void => {
    stakeLabels.push(era.toHuman());
    stakeChart.push(
      balanceToNumber(validators[validatorId]?.exposure.total.toBn() || new BN(0), divisor)
    );
  });

  return {
    stakeChart: [stakeChart],
    stakeLabels
  };
}

export default function Validator ({ className, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ blockChart, blockLabels }, setBlockChart] = useState<BlockChart>({ blockChart: [], blockLabels: [] });
  const [{ stakeChart, stakeLabels }, setStakeChart] = useState<StakeChart>({ stakeChart: [], stakeLabels: [] });
  const stakerRewards = useCall<DeriveStakerReward[]>(api.derive.staking.stakerRewards as any, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), [formatBalance]);

  useEffect((): void => {
    setBlockChart(extractBlocks(validatorId, stakerRewards));
    setStakeChart(extractStake(validatorId, divisor, stakerRewards));
  }, [stakerRewards, validatorId]);

  return (
    <Columar className={className}>
      <Column emptyText={t('Loading block data')}>
        {!!blockChart.length && (
          <div className='staking--Chart'>
            <h1>{t('blocks produced')}</h1>
            <Chart.Line
              colors={COLORS_BLOCKS}
              labels={blockLabels}
              legends={[t('blocks'), t('average')]}
              values={blockChart}
            />
          </div>
        )}
      </Column>
      <Column emptyText={t('Loading staker data')}>
        {stakeChart && !!stakeChart[0]?.length && (
          <div className='staking--Chart'>
            <h1>{t('elected stake')}</h1>
            <Chart.Line
              labels={stakeLabels}
              legends={[t('{{currency}} total', { replace: { currency } }), t('{{currency}} own', { replace: { currency } }), t('{{currency}} other', { replace: { currency } })]}
              values={stakeChart}
            />
          </div>
        )}
      </Column>
    </Columar>
  );
}
