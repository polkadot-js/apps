// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SessionIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Chart } from '@polkadot/react-components';
import { withCalls } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  blockCounts?: BN[];
  className?: string;
  currentIndex: SessionIndex;
  validatorId: string;
}

// assuming 4 hrs sessions, we we grab results for 10 days
const SESSIONS = 10 * (24 / 4);

function getIndexRange (currentIndex: SessionIndex): BN[] {
  const range: BN[] = [];
  let thisIndex: BN = currentIndex;

  while (thisIndex.gtn(0) && range.length < SESSIONS) {
    range.push(thisIndex);

    thisIndex = thisIndex.subn(1);
  }

  return range.reverse();
}

function Validator ({ blockCounts, className, currentIndex, t }: Props): React.ReactElement<Props> {
  const [labels, setLabels] = useState<string[]>([]);
  const [{ avgSet, idxSet }, setValues] = useState<{ avgSet: number[]; idxSet: BN[] }>({ avgSet: [], idxSet: [] });

  useEffect((): void => {
    setLabels(
      getIndexRange(currentIndex).map((index): string => formatNumber(index))
    );
  }, [currentIndex]);

  useEffect((): void => {
    if (blockCounts) {
      const avgSet: number[] = [];
      const idxSet: BN[] = [];

      blockCounts.reduce((total: BN, value, index): BN => {
        total = total.add(value);

        avgSet.push(total.toNumber() / (index + 1));
        idxSet.push(value);

        return total;
      }, new BN(0));

      setValues({ avgSet, idxSet });
    }
  }, [blockCounts, labels]);

  return (
    <div className={className}>
      <h1>{t('blocks per session')}</h1>
      <Chart.Line
        labels={labels}
        legends={[t('blocks'), t('average')]}
        values={[idxSet, avgSet]} />
    </div>
  );
}

export default translate(
  withCalls<Props>(
    ['query.imOnline.authoredBlocks', {
      isMulti: true,
      propName: 'blockCounts',
      paramPick: ({ currentIndex, validatorId }: Props): [BN, string][] =>
        getIndexRange(currentIndex).map((index): [BN, string] => [index, validatorId])
    }]
  )(Validator)
);
