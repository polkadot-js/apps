// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveEraRewards, DeriveOwnSlashes, DeriveStakerPoints } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';
import { balanceToNumber } from './util.js';

const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];

function extractRewards (labels: string[], erasRewards: DeriveEraRewards[], ownSlashes: DeriveOwnSlashes[], allPoints: DeriveStakerPoints[], divisor: BN): LineData {
  const slashSet = new Array<number>(labels.length);
  const rewardSet = new Array<number>(labels.length);
  const avgSet = new Array<number>(labels.length);
  const [total, avgCount] = erasRewards.reduce(([total, avgCount], { era, eraReward }) => {
    const points = allPoints.find((points) => points.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;

    if (reward > 0) {
      total += reward;
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  erasRewards.forEach(({ era, eraReward }): void => {
    const points = allPoints.find((points) => points.era.eq(era));
    const slashed = ownSlashes.find((slash) => slash.era.eq(era));
    const reward = points?.eraPoints.gtn(0)
      ? balanceToNumber(points.points.mul(eraReward).div(points.eraPoints), divisor)
      : 0;
    const slash = slashed
      ? balanceToNumber(slashed.total, divisor)
      : 0;
    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;
    const index = labels.indexOf(era.toHuman());

    if (index !== -1) {
      rewardSet[index] = reward;
      avgSet[index] = avg;
      slashSet[index] = slash;
    }
  });

  return [slashSet, rewardSet, avgSet];
}

function ChartRewards ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownSlashes = useCall<DeriveOwnSlashes[]>(api.derive.staking.ownSlashes, params);
  const erasRewards = useCall<DeriveEraRewards[]>(api.derive.staking.erasRewards);
  const stakerPoints = useCall<DeriveStakerPoints[]>(api.derive.staking.stakerPoints, params);
  const [values, setValues] = useState<LineData>([]);

  const { currency, divisor } = useMemo(
    () => ({
      currency: formatBalance.getDefaults().unit,
      divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
    }),
    []
  );

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => erasRewards && ownSlashes && stakerPoints && setValues(extractRewards(labels, erasRewards, ownSlashes, stakerPoints, divisor)),
    [labels, divisor, erasRewards, ownSlashes, stakerPoints]
  );

  const legends = useMemo(() => [
    t('{{currency}} slashed', { replace: { currency } }),
    t('{{currency}} rewards', { replace: { currency } }),
    t('{{currency}} average', { replace: { currency } })
  ], [currency, t]);

  return (
    <Chart
      colors={COLORS_REWARD}
      labels={labels}
      legends={legends}
      title={t('rewards & slashes')}
      values={values}
    />
  );
}

export default React.memo(ChartRewards);
