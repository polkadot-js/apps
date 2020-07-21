// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveOwnExposure } from '@polkadot/api-derive/types';
import { ChartInfo, LineDataEntry, Props } from './types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import { balanceToNumber } from './util';

const COLORS_STAKE = [undefined, '#8c2200', '#acacac'];

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

    if (cli > 0) {
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

function ChartStake ({ validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [{ chart, labels }, setChart] = useState<ChartInfo>({ chart: [], labels: [] });
  const ownExposures = useCall<DeriveOwnExposure[]>(api.derive.staking.ownExposures, [validatorId, true]);
  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), []);
  const legends = useMemo(() => [
    t<string>('{{currency}} clipped', { replace: { currency } }),
    t<string>('{{currency}} total', { replace: { currency } }),
    t<string>('{{currency}} average', { replace: { currency } })
  ], [currency, t]);

  useEffect((): void => {
    ownExposures && setChart(
      extractStake(ownExposures, divisor)
    );
  }, [divisor, ownExposures]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('elected stake')}</h1>
      {chart && !!chart[0]?.length
        ? (
          <Chart.Line
            colors={COLORS_STAKE}
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

export default React.memo(ChartStake);
