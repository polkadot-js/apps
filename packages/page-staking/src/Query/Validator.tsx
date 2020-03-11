// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveEraRewards, DeriveStakerExpoure, DeriveStakerPoints } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Columar, Column, Spinner } from '@polkadot/react-components';
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
const COLORS_POINTS = [undefined, '#acacac'];

function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}

function extractPoints (points: DeriveStakerPoints[]): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
  let total = 0;

  points.forEach(({ era, points }, index): void => {
    total += points.toNumber();
    labels.push(era.toHuman());

    avgSet.push(Math.ceil(total * 100 / (index + 1)) / 100);
    idxSet.push(points);
  });

  return {
    chart: [idxSet, avgSet],
    labels
  };
}

function extractRewards (erasRewards: DeriveEraRewards[], allPoints: DeriveStakerPoints[], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const slashSet: LineDataEntry = [];
  const rewardSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  let total = 0;

  erasRewards.forEach(({ era, eraReward }, index): void => {
    const points = allPoints.find((points) => points.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;

    total += reward;
    labels.push(era.toHuman());

    rewardSet.push(reward);
    avgSet.push(Math.ceil(total * 100 / (index + 1)) / 100);
    slashSet.push(0); // TODO
  });

  return {
    chart: [slashSet, rewardSet, avgSet],
    labels
  };
}

function extractStake (exposures: DeriveStakerExpoure[], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const stakeSet: LineDataEntry = [];

  exposures.forEach(({ era, isValidator, validators }): void => {
    labels.push(era.toHuman());
    stakeSet.push(
      balanceToNumber(
        isValidator
          ? Object.values(validators)[0].total.toBn()
          : new BN(0),
        divisor
      )
    );
  });

  return {
    chart: [stakeSet],
    labels
  };
}

export default function Validator ({ className, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ chart: pointChart, labels: pointLabels }, setPointChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const [{ chart: rewardChart, labels: rewardLabels }, setRewardChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const [{ chart: stakeChart, labels: stakeLabels }, setStakeCharts] = useState<ChartInfo>({ chart: [], labels: [] });
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards as any, []);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints as any, [validatorId, true]);
  const stakerExposure = useCall<DeriveStakerExpoure[]>(api.derive.staking.stakerExposure as any, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), [formatBalance]);

  useEffect((): void => {
    stakerPoints && setPointChart(extractPoints(stakerPoints));
  }, [stakerPoints]);

  useEffect((): void => {
    erasRewards && stakerPoints && setRewardChart(extractRewards(erasRewards, stakerPoints, divisor));
  }, [erasRewards, stakerPoints]);

  useEffect((): void => {
    stakerExposure && setStakeCharts(extractStake(stakerExposure, divisor));
  }, [stakerExposure]);

  return (
    <Columar className={className}>
      <Column>
        <div className='staking--Chart'>
          <h1>{t('era points')}</h1>
          {pointChart.length
            ? (
              <Chart.Line
                colors={COLORS_POINTS}
                labels={pointLabels}
                legends={[t('points'), t('average')]}
                values={pointChart}
              />
            )
            : <Spinner />
          }
        </div>
        <div className='staking--Chart'>
          <h1>{t('rewards & slashes')}</h1>
          {rewardChart.length
            ? (
              <Chart.Line
                colors={COLORS_REWARD}
                labels={rewardLabels}
                legends={[t('{{currency}} slashed', { replace: { currency } }), t('{{currency}} rewards', { replace: { currency } }), t('{{currency}} average', { replace: { currency } })]}
                values={rewardChart}
              />
            )
            : <Spinner />
          }
        </div>
      </Column>
      <Column>
        <div className='staking--Chart'>
          <h1>{t('elected stake')}</h1>
          {stakeChart && !!stakeChart[0]?.length
            ? (
              <Chart.Line
                labels={stakeLabels}
                legends={[t('{{currency}} total', { replace: { currency } }), t('{{currency}} own', { replace: { currency } }), t('{{currency}} other', { replace: { currency } })]}
                values={stakeChart}
              />
            )
            : <Spinner />
          }
        </div>
      </Column>
    </Columar>
  );
}
