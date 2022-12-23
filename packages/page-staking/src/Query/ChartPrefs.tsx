// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPrefs } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo, useRef } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_BILLION } from '@polkadot/util';

import { useTranslation } from '../translate';
import Chart from './Chart';

const MULT = new BN(100 * 100);
const COLORS_POINTS = [undefined, '#acacac'];

function extractPrefs (prefs: DeriveStakerPrefs[] = []): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
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

    labels.push(era.toHuman());
    avgSet.push(avg);
    idxSet.push(comm);
  });

  return {
    chart: [idxSet, avgSet],
    labels
  };
}

function ChartPrefs ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const stakerPrefs = useCall<DeriveStakerPrefs[]>(api.derive.staking.stakerPrefs, params);

  const { chart, labels } = useMemo(
    () => extractPrefs(stakerPrefs),
    [stakerPrefs]
  );

  const legendsRef = useRef([
    t<string>('commission'),
    t<string>('average')
  ]);

  return (
    <Chart
      colors={COLORS_POINTS}
      header={t<string>('commission')}
      labels={labels}
      legends={legendsRef.current}
      values={chart}
    />
  );
}

export default React.memo(ChartPrefs);
