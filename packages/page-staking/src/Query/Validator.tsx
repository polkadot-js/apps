// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveEraRewards, DeriveOwnExposure, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';

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

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];
const COLORS_POINTS = [undefined, '#acacac'];
const COLORS_STAKE = [undefined, '#8c2200', '#acacac'];

function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}

function extractPoints (points: DeriveStakerPoints[]): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
  let avgCount = 0;
  let total = 0;

  points.forEach(({ era, points }): void => {
    total += points.toNumber();
    labels.push(era.toHuman());

    if (total > 0) {
      avgCount++;
    }

    avgSet.push((avgCount ? Math.ceil(total * 100 / avgCount) : 0) / 100);
    idxSet.push(points);
  });

  return {
    chart: [idxSet, avgSet],
    labels
  };
}

function extractRewards (erasRewards: DeriveEraRewards[], ownSlashes: DeriveOwnSlashes[], allPoints: DeriveStakerPoints[], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const slashSet: LineDataEntry = [];
  const rewardSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  let avgCount = 0;
  let total = 0;

  erasRewards.forEach(({ era, eraReward }): void => {
    const points = allPoints.find((points) => points.era.eq(era));
    const slashed = ownSlashes.find((slash) => slash.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;
    const slash = slashed
      ? balanceToNumber(slashed.total, divisor)
      : 0;

    total += reward;

    if (total > 0) {
      avgCount++;
    }

    labels.push(era.toHuman());
    rewardSet.push(reward);
    avgSet.push((avgCount ? Math.ceil(total * 100 / avgCount) : 0) / 100);
    slashSet.push(slash);
  });

  return {
    chart: [slashSet, rewardSet, avgSet],
    labels
  };
}

function extractStake (exposures: DeriveOwnExposure[], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const cliSet: LineDataEntry = [];
  const expSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  let avgCount = 0;
  let total = 0;

  exposures.forEach(({ clipped, era, exposure }): void => {
    const cli = balanceToNumber(clipped.total.unwrap(), divisor);
    const exp = balanceToNumber(exposure.total.unwrap(), divisor);

    total += cli;

    if (total > 0) {
      avgCount++;
    }

    avgSet.push((avgCount ? Math.ceil(total * 100 / avgCount) : 0) / 100);
    labels.push(era.toHuman());
    cliSet.push(cli);
    expSet.push(exp);
  });

  return {
    chart: [cliSet, expSet, avgSet],
    labels
  };
}

function Validator ({ className, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ chart: pointChart, labels: pointLabels }, setPointChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const [{ chart: rewardChart, labels: rewardLabels }, setRewardChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const [{ chart: stakeChart, labels: stakeLabels }, setStakeCharts] = useState<ChartInfo>({ chart: [], labels: [] });
  const ownExposure = useCall<DeriveOwnExposure[]>(api.derive.staking.ownExposure as any, [validatorId, true]);
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes as any, [validatorId, true]);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards as any, []);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints as any, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), [formatBalance]);
  const legExpose = useMemo(() => [t('{{currency}} clipped', { replace: { currency } }), t('{{currency}} total', { replace: { currency } }), t('{{currency}} average', { replace: { currency } })], [currency, t]);
  const legPoints = useMemo(() => [t('points'), t('average')], [t]);
  const legReward = useMemo(() => [t('{{currency}} slashed', { replace: { currency } }), t('{{currency}} rewards', { replace: { currency } }), t('{{currency}} average', { replace: { currency } })], [currency, t]);

  useEffect((): void => {
    stakerPoints && setPointChart(
      extractPoints(stakerPoints)
    );
  }, [stakerPoints]);

  useEffect((): void => {
    erasRewards && ownSlashes && stakerPoints && setRewardChart(
      extractRewards(erasRewards, ownSlashes, stakerPoints, divisor)
    );
  }, [erasRewards, stakerPoints]);

  useEffect((): void => {
    ownExposure && setStakeCharts(
      extractStake(ownExposure, divisor)
    );
  }, [ownExposure]);

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
                legends={legPoints}
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
                legends={legReward}
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
                colors={COLORS_STAKE}
                labels={stakeLabels}
                legends={legExpose}
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

export default React.memo(Validator);
