// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { Balance, Hash, Exposure, SessionIndex } from '@polkadot/types/interfaces';
import { SessionRewards, Slash } from '@polkadot/react-hooks/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { Chart, Columar, Column } from '@polkadot/react-components';
import { toShortAddress } from '@polkadot/react-components/util';
import { getHistoric } from '@polkadot/react-api/util';
import { trackStream, useApiContext } from '@polkadot/react-hooks';
import { u32 } from '@polkadot/types';
import { formatBalance, formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  className?: string;
  sessionRewards: SessionRewards[];
  validatorId: string;
}

type LineDataEntry = (BN | number)[];

type LineData = LineDataEntry[];

interface SplitEntry {
  colors: string[];
  label: string;
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
  const last = values[values.length - 1][1];
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

function Validator ({ className, sessionRewards, t, validatorId }: Props): React.ReactElement<Props> {
  const { api } = useApiContext();
  // FIXME There is something seriously wrong in these two with "any" horrors
  const blockCounts = trackStream<u32[]>(api.query.imOnline?.authoredBlocks?.multi as any, [sessionRewards, validatorId], {
    paramMap: ([sessionRewards, validatorId]: [SessionRewards[], string]): any =>
      [sessionRewards.map(({ sessionIndex }): [SessionIndex, string] => [sessionIndex, validatorId])]
  });
  const [blocksLabels, setBlocksLabels] = useState<string[]>([]);
  const [blocksChart, setBlocksChart] = useState<LineData | null>(null);
  const [{ rewardsChart, rewardsLabels }, setRewardsInfo] = useState<{ rewardsChart: LineData | null; rewardsLabels: string[] }>({ rewardsChart: null, rewardsLabels: [] });
  const [{ splitChart, splitMax }, setSplitInfo] = useState<{ splitChart: SplitData | null; splitMax: number }>({ splitChart: null, splitMax: 100 });
  const [{ stakeChart, stakeLabels }, setStakeInfo] = useState<{ stakeChart: LineData | null; stakeLabels: string[]}>({ stakeChart: null, stakeLabels: [] });
  const divisor = new BN('1'.padEnd(formatBalance.getDefaults().decimals + 1, '0'));

  useEffect((): void => {
    if (!splitChart) {
      const hashes = sessionRewards.map(({ blockHash }): Hash => blockHash);
      const stakeLabels = sessionRewards.map(({ sessionIndex }): string => formatNumber(sessionIndex));

      api.isReady.then(async (): Promise<void> => {
        const values = await getHistoric<Exposure>(api, 'staking.stakers', [validatorId], hashes);
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

      sessionRewards.forEach(({ blockNumber, reward, sessionIndex, slashes }, index): void => {
        // this shows the start of the new era, however rewards are for previous
        rewardsLabels.push(formatNumber(sessionIndex.subn(1)));

        const neg = extractEraSlash(validatorId, slashes);
        const pos = index
          ? reward.mul(blockCounts[index - 1]).div(blockNumber.sub(sessionRewards[index - 1].blockNumber))
          : new BN(0);

        // add this to the total
        total = total.add(neg).add(pos);

        // calculate and format to 3 decimals
        rewardsChart[0].push(balanceToNumber(neg, divisor));
        rewardsChart[1].push(balanceToNumber(pos, divisor));
        rewardsChart[2].push(balanceToNumber(total.divn(index), divisor));
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

      blockCounts.reduce((total: BN, value: u32, index: number): BN => {
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
                  legends={[t('slashed'), t('rewards (est.)'), t('average')]}
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

export default translate(Validator);
