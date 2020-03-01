// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, Hash, Exposure } from '@polkadot/types/interfaces';
import { SessionRewards, Slash } from '../types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { toShortAddress } from '@polkadot/react-components/util';
import { getHistoric } from '@polkadot/react-api/util';
import { useApi } from '@polkadot/react-hooks';
import { formatBalance, formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import useBlockCounts from '../useBlockCounts';

interface Props {
  className?: string;
  sessionRewards: SessionRewards[];
  validatorId: string;
}

type LineDataEntry = (BN | number)[];

type LineData = LineDataEntry[];

interface SplitEntry {
  colors: string[];
  label: string;
  tooltip: string;
  value: number;
}

type SplitData = SplitEntry[];

const COLORS_MINE = ['#ff8c00'];
const COLORS_OTHER = ['#acacac'];
const COLORS_REWARD = ['#8c2200', '#008c22', '#acacac'];
const COLORS_BLOCKS = [undefined, '#acacac'];

function balanceToNumber (amount: BN, divisor: BN): number {
  return amount.muln(1000).div(divisor).toNumber() / 1000;
}

function extractStake (values: [Hash, Exposure][], divisor: BN): LineData {
  return [
    values.map(([, { total }]): number =>
      balanceToNumber(total.unwrap(), divisor))
    // exposures.map(({ own }): number =>
    //   balanceToNumber(own.unwrap(), divisor)),
    // exposures.map(({ others }): number =>
    //   balanceToNumber(
    //     others.reduce((total, { value }): number =>
    //       total.add(value.unwrap()), new BN(0)
    //     ), divisor))
  ];
}

function extractSplit (values: [Hash, Exposure][], validatorId: string): SplitData | null {
  if (!values.length) {
    return null;
  }

  const last = values[values.length - 1][1];
  const total = last.total.unwrap();

  if (total.eqn(0)) {
    return null;
  }

  const currency = formatBalance.getDefaults().unit;

  return [{ accountId: validatorId, isOwn: true, value: last.own.unwrap() }]
    .concat(last.others.map(({ who, value }): { accountId: string; isOwn: boolean; value: Balance } => ({
      accountId: who.toString(), isOwn: false, value: value.unwrap()
    })))
    .sort((a, b): number => b.value.cmp(a.value))
    .map(({ accountId, isOwn, value }): SplitEntry => {
      const label = toShortAddress(accountId);
      const percentage = value.muln(10000).div(total).toNumber() / 100;
      const tooltip = `${formatBalance(value, { forceUnit: '-', withSi: false })} ${currency} (${percentage.toFixed(2)}%)`;

      return {
        colors: isOwn ? COLORS_MINE : COLORS_OTHER,
        label,
        tooltip,
        value: percentage
      };
    });
}

function extractEraSlash (validatorId: string, slashes: Slash[]): BN {
  return slashes.reduce((total: BN, { accountId, amount }): BN => {
    return accountId.eq(validatorId)
      ? total.sub(amount)
      : total;
  }, new BN(0));
}

export default function Validator ({ className, sessionRewards, validatorId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const blockCounts = useBlockCounts(validatorId, sessionRewards);
  const [blocksLabels, setBlocksLabels] = useState<string[]>([]);
  const [blocksChart, setBlocksChart] = useState<LineData | null>(null);
  const [{ currency, divisor }] = useState<{ currency: string; divisor: BN }>({
    currency: formatBalance.getDefaults().unit,
    divisor: new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'))
  });
  const [{ rewardsChart, rewardsLabels }, setRewardsInfo] = useState<{ rewardsChart: LineData | null; rewardsLabels: string[] }>({ rewardsChart: null, rewardsLabels: [] });
  const [{ splitChart, splitMax }, setSplitInfo] = useState<{ splitChart: SplitData | null; splitMax: number }>({ splitChart: null, splitMax: 100 });
  const [{ stakeChart, stakeLabels }, setStakeInfo] = useState<{ stakeChart: LineData | null; stakeLabels: string[]}>({ stakeChart: null, stakeLabels: [] });

  useEffect((): void => {
    if (!splitChart) {
      const hashes = sessionRewards.map(({ blockHash }): Hash => blockHash);
      const stakeLabels = sessionRewards.map(({ sessionIndex }): string => formatNumber(sessionIndex));

      api.isReady.then(async (): Promise<void> => {
        const values = await getHistoric<Exposure>(api.query.staking.stakers.at, [validatorId], hashes);
        const stakeChart = extractStake(values, divisor);
        const splitChart = extractSplit(values, validatorId);
        const splitMax = splitChart ? Math.min(Math.ceil(splitChart[0].value), 100) : 100;

        setStakeInfo({ stakeChart, stakeLabels });
        setSplitInfo({ splitChart, splitMax });
      });
    }
  }, [sessionRewards, splitChart]);

  useEffect((): void => {
    if (blockCounts) {
      const rewardsLabels: string[] = [];
      const rewardsChart: LineData = [[], [], []];
      let total = new BN(0);
      let lastRewardIndex = 0;
      let rewardCount = 0;

      // we only work from the second position, the first deemed incomplete
      sessionRewards.forEach(({ blockNumber, reward, sessionIndex, slashes }, index): void => {
        // we are trying to find the first index where rewards are allocated, this is our start
        // since we only want complete eras, this means we drop some at the start
        if (lastRewardIndex === 0) {
          if (index && reward.gtn(0)) {
            lastRewardIndex = index;
          }

          return;
        }

        // slash is extracted from the available slashes
        const neg = extractEraSlash(validatorId, slashes);

        // start of a new session, use the counts for the previous
        const totalBlocks = blockCounts
          .filter((count, countIndex): boolean =>
            !!count && countIndex >= lastRewardIndex && countIndex < index)
          .reduce((total, count): BN => total.add(count), new BN(0));

        // calculate the rewards based on our total share
        const pos = reward
          .mul(totalBlocks)
          .div(blockNumber.sub(sessionRewards[lastRewardIndex].blockNumber));

        // add this to the total
        total = total.add(neg).add(pos);
        rewardCount++;

        // if we have a reward here, set the reward index for the next iteration
        if (reward.gtn(0)) {
          lastRewardIndex = index;
        }

        // this shows the start of the new era, however rewards are for previous
        rewardsLabels.push(formatNumber(sessionIndex.subn(1)));

        // calculate and format to 3 decimals
        rewardsChart[0].push(balanceToNumber(neg, divisor));
        rewardsChart[1].push(balanceToNumber(pos, divisor));
        rewardsChart[2].push(balanceToNumber(total.divn(rewardCount), divisor));
      });

      setRewardsInfo({ rewardsChart, rewardsLabels });
    }
  }, [blockCounts, sessionRewards, validatorId]);

  useEffect((): void => {
    setBlocksLabels(
      sessionRewards.map(({ sessionIndex }): string => formatNumber(sessionIndex))
    );
  }, [sessionRewards]);

  useEffect((): void => {
    if (blockCounts) {
      const avgSet: number[] = [];
      const idxSet: BN[] = [];

      blockCounts.reduce((total: BN, value, index): BN => {
        total = total.add(value);

        avgSet.push(total.muln(100).divn(index + 1).toNumber() / 100);
        idxSet.push(value);

        return total;
      }, new BN(0));

      setBlocksChart([idxSet, avgSet]);
    }
  }, [blockCounts]);

  return (
    <Columar className={className}>
      <Column emptyText={t('Loading block data')}>
        {(rewardsChart || blocksChart) && (
          <>
            {blocksChart && (
              <div className='staking--Chart'>
                <h1>{t('blocks produced')}</h1>
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
                <h1>{t('rewards & slashes')}</h1>
                <Chart.Line
                  colors={COLORS_REWARD}
                  labels={rewardsLabels}
                  legends={[t('{{currency}} slashed', { replace: { currency } }), t('{{currency}} rewards (est.)', { replace: { currency } }), t('{{currency}} average', { replace: { currency } })]}
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
            {stakeChart && stakeChart[0].length !== 0 && (
              <div className='staking--Chart'>
                <h1>{t('elected stake')}</h1>
                <Chart.Line
                  labels={stakeLabels}
                  legends={[t('{{currency}} total', { replace: { currency } }), t('{{currency}} own', { replace: { currency } }), t('{{currency}} other', { replace: { currency } })]}
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
