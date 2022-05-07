// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveReferendumExt } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Badge, Button, Icon, LinkExternal, Progress } from '@polkadot/react-components';
import { useAccounts, useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { BN, BN_ONE, formatNumber, isBoolean } from '@polkadot/util';

import { useTranslation } from '../translate';
import useChangeCalc from '../useChangeCalc';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import ReferendumVotes from './ReferendumVotes';
import Voting from './Voting';

interface Props {
  className?: string;
  value: DeriveReferendumExt;
}

interface Percentages {
  aye: string;
  nay: string;
  turnout: string;
}

interface VoteType {
  hasVoted: boolean;
  hasVotedAye: boolean;
}

function percentage (val: BN, div: BN): string {
  return Math.min(100, val.muln(10000).div(div).toNumber() / 100).toFixed(2);
}

function Referendum ({ className = '', value: { allAye, allNay, image, imageHash, index, isPassing, status, voteCountAye, voteCountNay, votedAye, votedNay, votedTotal } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const bestNumber = useBestNumber();
  const totalIssuance = useCall<Balance>(api.query.balances?.totalIssuance);
  const { changeAye, changeNay } = useChangeCalc(status.threshold, votedAye, votedNay, votedTotal);
  const threshold = useMemo(
    () => status.threshold.type.toString().replace('majority', ' majority '),
    [status]
  );
  const totalCalculated = votedAye.add(votedNay);

  const [percentages, { hasVoted, hasVotedAye }] = useMemo(
    (): [Percentages | null, VoteType] => {
      if (totalIssuance) {
        const aye = allAye.reduce((total: BN, { balance }) => total.add(balance), new BN(0));
        const nay = allNay.reduce((total: BN, { balance }) => total.add(balance), new BN(0));
        const hasVotedAye = allAye.some(({ accountId }) => allAccounts.includes(accountId.toString()));

        return [
          {
            aye: votedTotal.isZero()
              ? ''
              : `${percentage(aye, votedTotal)}%`,
            nay: votedTotal.isZero()
              ? ''
              : `${percentage(nay, votedTotal)}%`,
            turnout: `${percentage(votedTotal, totalIssuance)}%`
          },
          {
            hasVoted: hasVotedAye || allNay.some(({ accountId }) => allAccounts.includes(accountId.toString())),
            hasVotedAye
          }
        ];
      } else {
        return [null, { hasVoted: false, hasVotedAye: false }];
      }
    },
    [allAccounts, allAye, allNay, totalIssuance, votedTotal]
  );

  if (!bestNumber || status.end.sub(bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = status.end.add(status.delay);
  const remainBlock = status.end.sub(bestNumber).isub(BN_ONE);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='number together media--1200'>
        <BlockToTime value={remainBlock} />
        {t<string>('{{blocks}} blocks', { replace: { blocks: formatNumber(remainBlock) } })}
      </td>
      <td className='number together media--1400'>
        <BlockToTime value={enactBlock.sub(bestNumber)} />
        #{formatNumber(enactBlock)}
      </td>
      <td className='number together media--1400'>
        {percentages && (
          <>
            <div>{percentages.turnout}</div>
          </>
        )}
      </td>
      <td className='badge'>
        {isBoolean(isPassing) && (
          <Badge
            color={isPassing ? 'green' : 'red'}
            hover={
              isPassing
                ? t<string>('{{threshold}}, passing', { replace: { threshold } })
                : t<string>('{{threshold}}, not passing', { replace: { threshold } })
            }
            icon={isPassing ? 'check' : 'times'}
          />
        )}
      </td>
      <td className='expand'>
        <ReferendumVotes
          change={changeAye}
          count={voteCountAye}
          isAye
          isWinning={isPassing}
          total={votedAye}
          votes={allAye}
        />
        <ReferendumVotes
          change={changeNay}
          count={voteCountNay}
          isAye={false}
          isWinning={!isPassing}
          total={votedNay}
          votes={allNay}
        />
      </td>
      <td className='media--1000 middle chart'>
        <Progress
          total={totalCalculated}
          value={votedAye}
        />
      </td>
      <td className='button'>
        <Button.Group>
          {!image?.proposal && (
            <PreImageButton imageHash={imageHash} />
          )}
          <Voting
            proposal={image?.proposal}
            referendumId={index}
          />
        </Button.Group>
      </td>
      <td className='badge'>
        <Icon
          color={hasVoted ? (hasVotedAye ? 'green' : 'red') : 'gray'}
          icon='asterisk'
        />
      </td>
      <td className='links media--1000'>
        <LinkExternal
          data={index}
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Referendum)`
  td.chart {
    padding: 0.5rem 0;

    .ui--Progress {
      display: inline-block;
    }
  }
`);
