// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { BlockNumber, Exposure, Hash, SessionIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { ApiContext, withCalls } from '@polkadot/react-api';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  blockCounts?: BN[];
  className?: string;
  currentIndex: SessionIndex;
  startNumber: BlockNumber;
  validatorId: string;
}

type LineData = (BN | number)[][];

// assuming 4 hrs sessions, we grab results for 10 days
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

function Validator ({ blockCounts, className, currentIndex, startNumber, t, validatorId }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [blocksLabels, setBlocksLabels] = useState<string[]>([]);
  const [blocksChart, setBlocksChart] = useState<LineData | undefined>();
  const [stakeLabels, setStakeLabels] = useState<string[]>([]);
  const [stakeChart, setStateChart] = useState<LineData | undefined>();

  useEffect((): void => {
    const numbers: BN[] = [];
    const checkLength = (api.consts.babe
      ? api.consts.babe.epochDuration as BlockNumber
      : new BN(500)).muln(2).divn(3);
    const divisor = new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'));

    api.isReady.then((): void => {
      let currentNumber: BN = startNumber;

      // here we end up with more-or-less 6.66 days
      while (startNumber.gtn(0) && numbers.length < SESSIONS) {
        numbers.unshift(currentNumber);
        currentNumber = currentNumber.sub(checkLength);
      }

      setStakeLabels(numbers.map((bn): string => formatNumber(bn)));

      Promise
        .all(numbers.map((at): Promise<Hash> =>
          api.rpc.chain.getBlockHash(at as any)
        ))
        .then((hashes): Promise<Exposure[]> =>
          Promise.all(hashes.map((hash): Promise<Exposure> =>
            api.query.staking.stakers.at(hash, validatorId) as Promise<Exposure>
          ))
        )
        .then((exposures): void => {
          setStateChart([
            exposures.map(({ total }): BN =>
              total.unwrap().div(divisor))
            // exposures.map(({ own }): BN =>
            //   own.unwrap().div(divisor)),
            // exposures.map(({ others }): BN =>
            //   others.reduce((total, { value }): BN => total.add(value.unwrap()), new BN(0)).div(divisor))
          ]);
        });
    });
  }, []);

  useEffect((): void => {
    setBlocksLabels(
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

      setBlocksChart([idxSet, avgSet]);
    }
  }, [blockCounts, blocksLabels]);

  return (
    <Columar className={className}>
      <Column
        emptyText={t('Loading data')}
        headerText={t('blocks per session')}
      >
        {blocksChart && (
          <Chart.Line
            colors={[undefined, '#acacac']}
            labels={blocksLabels}
            legends={[t('blocks'), t('average')]}
            values={blocksChart}
          />
        )}
      </Column>
      <Column
        emptyText={t('Loading data')}
        headerText={t('elected stake')}
      >
        {stakeChart && (
          <Chart.Line
            labels={stakeLabels}
            legends={[t('total'), t('own'), t('other')]}
            values={stakeChart}
          />
        )}
      </Column>
    </Columar>
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
