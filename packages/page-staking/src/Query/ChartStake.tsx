// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveOwnExposure } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import Chart from './Chart';
import { balanceToNumber } from './util';

const COLORS_STAKE = [undefined, '#8c2200', '#acacac'];

function extractStake (exposures: DeriveOwnExposure[] = [], divisor: BN): ChartInfo {
  const labels: string[] = [];
  const cliSet: LineDataEntry = [];
  const expSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  const [total, avgCount] = exposures.reduce(([total, avgCount], { clipped }) => {
    const cli = balanceToNumber(clipped.total?.unwrap(), divisor);

    if (cli > 0) {
      total += cli;
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  exposures.forEach(({ clipped, era, exposure }): void => {
    // Darwinia Crab doesn't have the total field
    const cli = balanceToNumber(clipped.total?.unwrap(), divisor);
    const exp = balanceToNumber(exposure.total?.unwrap(), divisor);
    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;

    labels.push(era.toHuman());
    avgSet.push(avg);
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
  const params = useMemo(() => [validatorId, false], [validatorId]);
  const ownExposures = useCall<DeriveOwnExposure[]>(api.derive.staking.ownExposures, params);

  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), []);

  const { chart, labels } = useMemo(
    () => extractStake(ownExposures, divisor),
    [divisor, ownExposures]
  );

  const legends = useMemo(() => [
    t<string>('{{currency}} clipped', { replace: { currency } }),
    t<string>('{{currency}} total', { replace: { currency } }),
    t<string>('{{currency}} average', { replace: { currency } })
  ], [currency, t]);

  return (
    <Chart
      colors={COLORS_STAKE}
      header={t<string>('elected stake')}
      labels={labels}
      legends={legends}
      values={chart}
    />
  );
}

export default React.memo(ChartStake);
