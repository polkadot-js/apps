// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveEraRewards, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';
import { ChartInfo, LineDataEntry, Props } from './types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import { balanceToNumber } from './util';

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];

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

    if (reward > 0) {
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

function ChartRewards ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ chart, labels }, setChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes as any, [validatorId, true]);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards as any, []);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints as any, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), [formatBalance]);
  const legends = useMemo(() => [
    t('{{currency}} slashed', { replace: { currency } }),
    t('{{currency}} rewards', { replace: { currency } }),
    t('{{currency}} average', { replace: { currency } })
  ], [currency, t]);

  useEffect((): void => {
    erasRewards && ownSlashes && stakerPoints && setChart(
      extractRewards(erasRewards, ownSlashes, stakerPoints, divisor)
    );
  }, [erasRewards, stakerPoints]);

  return (
    <div className='staking--Chart'>
      <h1>{t('rewards & slashes')}</h1>
      {chart.length
        ? (
          <Chart.Line
            colors={COLORS_REWARD}
            labels={labels}
            legends={legends}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartRewards);
