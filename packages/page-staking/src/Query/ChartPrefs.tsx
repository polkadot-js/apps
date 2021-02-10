// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakerPrefs } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import BN from 'bn.js';
import React, { useMemo, useRef } from 'react';

import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_BILLION } from '@polkadot/util';

import { useTranslation } from '../translate';

const MULT = new BN(100 * 100);
const COLORS_POINTS = [undefined, '#acacac'];

function extractPrefs (prefs: DeriveStakerPrefs[] = []): ChartInfo {
  const labels: string[] = [];
  const avgSet: LineDataEntry = [];
  const idxSet: LineDataEntry = [];
  let avgCount = 0;
  let total = 0;

  prefs.forEach(({ era, validatorPrefs }): void => {
    const comm = validatorPrefs.commission.unwrap().mul(MULT).div(BN_BILLION).toNumber() / 100;

    total += comm;
    labels.push(era.toHuman());

    if (comm !== 0) {
      avgCount++;
    }

    avgSet.push((avgCount ? Math.ceil(total * 100 / avgCount) : 0) / 100);
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
    <div className='staking--Chart'>
      <h1>{t<string>('commission')}</h1>
      {labels.length
        ? (
          <Chart.Line
            colors={COLORS_POINTS}
            labels={labels}
            legends={legendsRef.current}
            values={chart}
          />
        )
        : <Spinner />
      }
    </div>
  );
}

export default React.memo(ChartPrefs);
