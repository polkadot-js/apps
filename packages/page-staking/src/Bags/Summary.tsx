// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { BagMap } from './types.js';

import React, { useMemo } from 'react';

import { CardSummary, SummaryBox } from '@polkadot/react-components';
import { useCall } from '@polkadot/react-hooks';
import { formatNumber, isNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import useQueryModule from './useQueryModule.js';

interface Props {
  bags?: unknown[];
  className?: string;
  mapOwn?: BagMap;
}

function Summary ({ bags, className = '', mapOwn }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const mod = useQueryModule();
  const total = useCall<BN>(mod.counterForListNodes);

  const myCount = useMemo(
    () => mapOwn && Object.values(mapOwn).reduce((count, n) => count + n.length, 0),
    [mapOwn]
  );

  return (
    <SummaryBox className={className}>
      <CardSummary label={t('total bags')}>
        {bags
          ? formatNumber(bags.length)
          : <span className='--tmp'>99</span>
        }
      </CardSummary>
      <section>
        <CardSummary label={t('total nodes')}>
          {mapOwn
            ? formatNumber(total)
            : <span className='--tmp'>99</span>
          }
        </CardSummary>
        <CardSummary label={t('my nodes')}>
          {isNumber(myCount)
            ? formatNumber(myCount)
            : <span className='--tmp'>99</span>
          }
        </CardSummary>
      </section>
    </SummaryBox>
  );
}

export default React.memo(Summary);
