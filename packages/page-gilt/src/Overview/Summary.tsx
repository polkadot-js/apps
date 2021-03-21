// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActiveGiltsTotal } from '@polkadot/types/interfaces';

import React from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useApi, useBestNumber } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  activeTotal?: ActiveGiltsTotal;
  className?: string;
}

function Summary ({ activeTotal, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useBestNumber();

  return (
    <SummaryBox className={className}>
      <section>
        {activeTotal && (
          <CardSummary label={t<string>('total')}>
            {formatNumber(activeTotal.index)}
          </CardSummary>
        )}
      </section>
      <section>
        {bestNumber && (
          <CardSummary
            label={t<string>('intake')}
            progress={{
              total: api.consts.gilt.intakePeriod,
              value: bestNumber.mod(api.consts.gilt.intakePeriod),
              withTime: true
            }}
          />
        )}
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
