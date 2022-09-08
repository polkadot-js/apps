// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExposureT as DarwiniaStakingStructsExposure } from '@darwinia/types/interfaces/darwiniaInject';
import type { DeriveOwnExposure } from '@polkadot/api-derive/types';
import type { ChartInfo, LineDataEntry, Props } from './types';

import React, { useMemo } from 'react';

import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { Chart, Spinner } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BN, BN_ZERO, formatBalance } from '@polkadot/util';

import { useTranslation } from '../translate';
import { balanceToNumber } from './util';

const COLORS_STAKE = [undefined, '#8c2200', '#acacac'];

function extractStake (exposures: DeriveOwnExposure[] = [], divisor: BN, isDarwinia: boolean): ChartInfo {
  const labels: string[] = [];
  const cliSet: LineDataEntry = [];
  const expSet: LineDataEntry = [];
  const avgSet: LineDataEntry = [];
  const [total, avgCount] = exposures.reduce(([total, avgCount], { clipped }) => {
    let cli = 0;

    if (isDarwinia) {
      const darwiniaClipped = clipped as unknown as DarwiniaStakingStructsExposure;

      cli = balanceToNumber(darwiniaClipped.totalPower ?? BN_ZERO, divisor);
    } else {
      cli = balanceToNumber(clipped.total?.unwrap(), divisor);
    }

    if (cli > 0) {
      total += cli;
      avgCount++;
    }

    return [total, avgCount];
  }, [0, 0]);

  exposures.forEach(({ clipped, era, exposure }): void => {
    // Darwinia Crab doesn't have the total field
    let cli: number | BN;

    if (isDarwinia) {
      const darwiniaClipped = clipped as unknown as DarwiniaStakingStructsExposure;

      cli = darwiniaClipped.totalPower ?? BN_ZERO;
    } else {
      cli = balanceToNumber(clipped.total?.unwrap(), divisor);
    }

    let exp;

    if (isDarwinia) {
      const darwiniaExposure = exposure as unknown as DarwiniaStakingStructsExposure;

      exp = darwiniaExposure.totalPower ?? BN_ZERO;
    } else {
      exp = balanceToNumber(exposure.total?.unwrap(), divisor);
    }

    const avg = avgCount > 0
      ? Math.ceil(total * 100 / avgCount) / 100
      : 0;

    labels.push(era.toHuman());
    const avgBN = new BN(`${Math.floor(avg)}`)
    /* to convert avg to balance, multiply by divisor since when we were calculating total
    * in the above logic we used the method balanceToNumber which divided the
    * power by the divisor */
    const darwiniaPowerAvg = avgBN.mul(divisor);
    const avgItem = isDarwinia ? darwiniaPowerAvg : avg;

    avgSet.push(avgItem);
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
  const isDarwinia = rpcNetwork.isDarwinia();
  const ownExposures = useCall<DeriveOwnExposure[]>(api.derive.staking.ownExposures, params);

  const { currency, divisor } = useMemo((): { currency: string; divisor: BN } => ({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  }), []);

  const { chart, labels } = useMemo(
    () => extractStake(ownExposures, divisor, isDarwinia),
    [divisor, isDarwinia, ownExposures]
  );

  const powerUnit = t('power', 'power');
  const unit = isDarwinia ? `${powerUnit.slice(0, 1).toUpperCase()}${powerUnit.slice(1)}` : currency;
  const legends = useMemo(() => [
    t<string>('{{currency}} clipped', { replace: { currency: unit } }),
    t<string>('{{currency}} total', { replace: { currency: unit } }),
    t<string>('{{currency}} average', { replace: { currency: unit } })
  ], [t, unit]);

  return (
    <div className='staking--Chart'>
      <h1>{t<string>('elected stake')}</h1>
      {labels.length
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
