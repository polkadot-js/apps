// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Balance, BlockNumber, Hash, Exposure, SessionIndex } from '@polkadot/types/interfaces';
import { SessionRewards, Slash } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { toShortAddress } from '@polkadot/react-components/util';
import { withCalls } from '@polkadot/react-api';
import { getHistoric } from '@polkadot/react-api/util';
import { useApiContext } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { MAX_SESSIONS } from '../constants';
import translate from '../translate';

interface Props extends I18nProps {
  blockCounts?: BN[];
  className?: string;
  currentIndex: SessionIndex;
  sessionRewards: SessionRewards[];
  startNumber: BlockNumber;
  validatorId: string;
}

type LineData = (BN | number)[][];

interface SplitEntry {
  colors: string[];
  label: string;
  value: number;
}

type SplitData = SplitEntry[];

const COLORS_MINE = ['#ff8c00'];
const COLORS_OTHER = ['#acacac'];
const COLORS_BLOCKS = [undefined, '#acacac'];

function getIndexRange (currentIndex: SessionIndex): BN[] {
  const range: BN[] = [];
  let thisIndex: BN = currentIndex;

  while (thisIndex.gtn(0) && range.length < MAX_SESSIONS) {
    range.push(thisIndex);

    thisIndex = thisIndex.subn(1);
  }

  return range.reverse();
}

function extractStake (values: [BN, Hash, Exposure][], divisor: BN): [string[], LineData] {
  return [
    values.map(([bn]): string => formatNumber(bn)),
    [
      values.map(([,, { total }]): BN =>
        total.unwrap().div(divisor))
      // exposures.map(({ own }): BN =>
      //   own.unwrap().div(divisor)),
      // exposures.map(({ others }): BN =>
      //   others.reduce((total, { value }): BN => total.add(value.unwrap()), new BN(0)).div(divisor))
    ]
  ];
}

function extractSplit (values: [BN, Hash, Exposure][], validatorId: string): SplitData | null {
  const last = values[values.length - 1][2];
  const total = last.total.unwrap();

  if (total.eqn(0)) {
    return null;
  }

  return [{ accountId: validatorId, isOwn: true, value: last.own.unwrap() }]
    .concat(last.others.map(({ who, value }): { accountId: string; isOwn: boolean; value: Balance } => ({
      accountId: who.toString(), isOwn: false, value: value.unwrap()
    })))
    .sort((a, b): number => b.value.cmp(a.value))
    .map(({ accountId, isOwn, value }): SplitEntry => ({
      colors: isOwn ? COLORS_MINE : COLORS_OTHER,
      label: toShortAddress(accountId),
      value: value.muln(10000).div(total).toNumber() / 100
    }));
}

function extractEraSlash (validatorId: string, slashes: Slash[]): BN {
  return slashes.reduce((total: BN, { accountId, amount }): BN => {
    return accountId.eq(validatorId)
      ? total.sub(amount)
      : total;
  }, new BN(0));
}

function Validator ({ blockCounts, className, currentIndex, sessionRewards, startNumber, t, validatorId }: Props): React.ReactElement<Props> {
  const { api } = useApiContext();
  const [blocksLabels, setBlocksLabels] = useState<string[]>([]);
  const [blocksChart, setBlocksChart] = useState<LineData | null>(null);
  const [{ rewardsChart, rewardsLabels }, setRewardsInfo] = useState<{ rewardsChart: LineData | null; rewardsLabels: string[] }>({ rewardsChart: null, rewardsLabels: [] });
  const [{ splitChart, splitMax }, setSplitInfo] = useState<{ splitChart: SplitData | null; splitMax: number }>({ splitChart: null, splitMax: 100 });
  const [{ stakeChart, stakeLabels }, setStakeInfo] = useState<{ stakeChart: LineData | null; stakeLabels: string[]}>({ stakeChart: null, stakeLabels: [] });
  const divisor = new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'));

  useEffect((): void => {
    api.isReady.then(async (): Promise<void> => {
      const values = await getHistoric<Exposure>(api, 'staking.stakers', [validatorId], {
        interval: (api.consts.babe?.epochDuration as BlockNumber || new BN(500)).muln(2).divn(3),
        max: MAX_SESSIONS,
        startNumber
      });
      const [stakeLabels, stakeChart] = extractStake(values, divisor);
      const splitChart = extractSplit(values, validatorId);
      const splitMax = splitChart ? Math.min(Math.ceil(splitChart[0].value), 100) : 100;

      setStakeInfo({ stakeChart, stakeLabels });
      setSplitInfo({ splitChart, splitMax });
    });
  }, []);

  useEffect((): void => {
    const rewardsLabels: string[] = [];
    const rewardsChart: LineData = [[]];

    sessionRewards.forEach(({ sessionIndex, slashes }): void => {
      // this shows the start of the new era, however rewards are for previous
      rewardsLabels.push(formatNumber(sessionIndex.subn(1)));

      // calculate and format to 3 decimals
      rewardsChart[0].push(
        extractEraSlash(validatorId, slashes).muln(1000).div(divisor).toNumber() / 1000
      );
    });

    setRewardsInfo({ rewardsChart, rewardsLabels });
  }, [sessionRewards, validatorId]);

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
      <Column emptyText={t('Loading block data')}>
        {(rewardsChart || blocksChart) && (
          <>
            {blocksChart && (
              <div className='staking--Chart'>
                <h1>{t('blocks per session')}</h1>
                <Chart.Line
                  colors={COLORS_BLOCKS}
                  labels={blocksLabels}
                  legends={[t('blocks'), t('average')]}
                  values={blocksChart}
                />
              </div>
            )}
            {rewardsChart && (
              <div className='staking--Chart'>
                <h1>{t('slashed per session')}</h1>
                <Chart.Line
                  colors={COLORS_BLOCKS}
                  labels={rewardsLabels}
                  legends={[t('slashed'), t('rewarded')]}
                  values={rewardsChart}
                />
              </div>
            )}
          </>
        )}
      </Column>
      <Column emptyText={t('Loading staker data')}>
        {(stakeChart || splitChart) && (
          <>
            {stakeChart && (
              <div className='staking--Chart'>
                <h1>{t('elected stake')}</h1>
                <Chart.Line
                  labels={stakeLabels}
                  legends={[t('total'), t('own'), t('other')]}
                  values={stakeChart}
                />
              </div>
            )}
            {splitChart && (
              <div className='staking--Chart'>
                <h1>{t('staker percentages')}</h1>
                <Chart.HorizBar
                  aspectRatio={2}
                  max={splitMax}
                  values={splitChart}
                />
              </div>
            )}
          </>
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
