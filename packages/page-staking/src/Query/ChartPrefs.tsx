// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPrefs } from '@polkadot/api-derive/types';
import type { LineData, Props } from './types.js';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_BILLION } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Chart from './Chart.js';

const MULT = new BN(100 * 100);
const COLORS_POINTS = [undefined, '#acacac'];

function extractPrefs (labels: string[], prefs: DeriveStakerPrefs[]): LineData {
  const avgSet = new Array<number>(labels.length);
  const idxSet = new Array<number>(labels.length);
  const [total, avgCount] = prefs.reduce(([total, avgCount], { validatorPrefs }) => {
    const comm = validatorPrefs.commission.unwrap().mul(MULT).div(BN_BILLION).toNumber() / 100;

    if (comm !== 0) {
      total += comm;
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  prefs.forEach(({ era, validatorPrefs }): void => {
    const comm = validatorPrefs.commission.unwrap().mul(MULT).div(BN_BILLION).toNumber() / 100;
    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;
    const index = labels.indexOf(era.toHuman());

    if (index !== -1) {
      avgSet[index] = avg;
      idxSet[index] = comm;
    }
  });

  return [idxSet, avgSet];
}

function ChartPrefs ({ labels, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPrefs = useCall<DeriveStakerPrefs[]>(api.derive.staking.stakerPrefs, params);
  const [values, setValues] = useState<LineData>([]);

  useEffect(
    () => setValues([]),
    [validatorId]
  );

  useEffect(
    () => stakerPrefs && setValues(extractPrefs(labels, stakerPrefs)),
    [labels, stakerPrefs]
  );

  const legendsRef = useRef([
    t('commission'),
    t('average')
  ]);

  return (
    <Chart
      colors={COLORS_POINTS}
      labels={labels}
      legends={legendsRef.current}
      title={t('commission')}
      values={values}
    />
  );
}

export default React.memo(ChartPrefs);
