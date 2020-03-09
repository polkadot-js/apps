// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  validatorId: string;
}

type LineDataEntry = (BN | number)[];

type LineData = LineDataEntry[];

interface ChartInfo {
  chart: LineData;
  labels: string[];
}

// interface SplitEntry {
//   colors: string[];
//   label: string;
//   tooltip: string;
//   value: number;
// }

// type SplitData = SplitEntry[];

// const COLORS_MINE = ['#ff8c00'];
// const COLORS_OTHER = ['#acacac'];

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];
const COLORS_BLOCKS = [undefined, '#acacac'];

function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}

function extractCharts (validatorId: string, divisor: BN, rewards: DeriveStakerReward[] = []): [ChartInfo, ChartInfo, ChartInfo] {
  const labels: string[] = [];
  const blockAvgSet: LineDataEntry = [];
  const blockIdxSet: LineDataEntry = [];
  const slashSet: LineDataEntry = [];
  const rewardSet: LineDataEntry = [];
  const rewardAvgSet: LineDataEntry = [];
  const stakeSet: LineDataEntry = [];
  let blockTotal = 0;
  let rewardTotal = 0;

  rewards.forEach(({ era, eraPoints, eraReward, validators }, index): void => {
    const points = validators[validatorId]?.points || new BN(0);
    const myReward = eraPoints.gtn(0)
      ? balanceToNumber(
        points
          .mul(eraReward)
          .div(eraPoints),
        divisor
      )
      : 0;

    blockTotal += points.toNumber();
    rewardTotal += myReward;

    labels.push(era.toHuman());

    blockAvgSet.push(Math.ceil(blockTotal * 100 / (index + 1)) / 100);
    blockIdxSet.push(points);

    rewardSet.push(myReward);
    rewardAvgSet.push(Math.ceil(rewardTotal * 100 / (index + 1)) / 100);
    slashSet.push(0); // TODO

    stakeSet.push(
      balanceToNumber(validators[validatorId]?.exposure.total.toBn() || new BN(0), divisor)
    );
  });

  return [
    { chart: [blockIdxSet, blockAvgSet], labels },
    { chart: [slashSet, rewardSet, rewardAvgSet], labels },
    { chart: [stakeSet], labels }
  ];
}

export default function Validator ({ className, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [[{ chart: blockChart, labels: blockLabels }, { chart: rewardChart, labels: rewardLabels }, { chart: stakeChart, labels: stakeLabels }], setCharts] = useState<[ChartInfo, ChartInfo, ChartInfo]>([{ chart: [], labels: [] }, { chart: [], labels: [] }, { chart: [], labels: [] }]);
  const stakerRewards = useCall<DeriveStakerReward[]>(api.derive.staking.stakerRewards as any, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), [formatBalance]);

  useEffect((): void => {
    setCharts(extractCharts(validatorId, divisor, stakerRewards));
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
        {!!rewardChart.length && (
          <div className='staking--Chart'>
            <h1>{t('rewards & slashes')}</h1>
            <Chart.Line
              colors={COLORS_REWARD}
              labels={rewardLabels}
              legends={[t('{{currency}} slashed', { replace: { currency } }), t('{{currency}} rewards', { replace: { currency } }), t('{{currency}} average', { replace: { currency } })]}
              values={rewardChart}
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
