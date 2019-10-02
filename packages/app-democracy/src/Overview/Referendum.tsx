/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ReferendumInfoExtended } from '@polkadot/api-derive/type';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ActionItem, Chart, Static, Voting } from '@polkadot/react-components';
import { formatBalance, formatNumber } from '@polkadot/util';
import VoteThreshold from '@polkadot/react-params/Param/VoteThreshold';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../translate';

const COLORS_AYE = ['#64bebe', '#5badad'];
const COLORS_NAY = ['#d75ea1', '#e189ba'];

interface Props extends I18nProps {
  idNumber: BN;
  chain_bestNumber?: BN;
  democracy_referendumVotesFor?: DerivedReferendumVote[];
  democracy_enactmentPeriod: BN;
  value: ReferendumInfoExtended;
}

interface State {
  voteCount: number;
  voteCountAye: number;
  voteCountNay: number;
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

function Referendum ({ chain_bestNumber, className, democracy_enactmentPeriod, democracy_referendumVotesFor, t, value }: Props): React.ReactElement<Props> | null {
  const [{ voteCount, voteCountAye, voteCountNay, votedAye, votedNay, votedTotal }, setState] = useState<State>({
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });

  useEffect((): void => {
    if (democracy_referendumVotesFor) {
      const newState: State = democracy_referendumVotesFor.reduce((state, { balance, vote }): State => {
        if (vote.isAye) {
          state.voteCountAye++;
          state.votedAye = state.votedAye.add(balance);
        } else {
          state.voteCountNay++;
          state.votedNay = state.votedNay.add(balance);
        }

        state.voteCount++;
        state.votedTotal = state.votedTotal.add(balance);

        return state;
      }, {
        voteCount: 0,
        voteCountAye: 0,
        voteCountNay: 0,
        votedAye: new BN(0),
        votedNay: new BN(0),
        votedTotal: new BN(0)
      });

      if (newState.votedAye.eq(votedNay) && newState.votedNay.eq(votedNay)) {
        return;
      }

      setState(newState);
    }
  }, [democracy_referendumVotesFor]);

  if (!chain_bestNumber || value.end.sub(chain_bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = (democracy_enactmentPeriod || new BN(0)).add(value.end);

  return (
    <ActionItem
      className={className}
      idNumber={value.index}
      proposal={value.proposal}
      accessory={
        <Voting
          idNumber={value.index}
          proposal={value.proposal}
        />
      }
    >
      <div>
        {voteCount !== 0 && votedTotal.gtn(0) && (
          <div className='democracy--Referendum-results chart'>
            <Chart.HorizBar
              values={[
                {
                  colors: COLORS_AYE,
                  label: `Aye, ${formatBalance(votedAye)} (${formatNumber(voteCountAye)})`,
                  value: votedAye.muln(10000).div(votedTotal).toNumber() / 100
                },
                {
                  colors: COLORS_NAY,
                  label: `Nay, ${formatBalance(votedNay)} (${formatNumber(voteCountNay)})`,
                  value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
                }
              ]}
            />
          </div>
        )}
        <Static label={t('ending at')}>
          {t('block #{{blockNumber}}, {{remaining}} blocks remaining', {
            replace: {
              blockNumber: formatNumber(value.end),
              remaining: formatNumber(value.end.sub(chain_bestNumber).subn(1))
            }
          })}
        </Static>
        <Static label={t('activate at (if passed)')}>
          {t('block #{{blockNumber}}', {
            replace: {
              blockNumber: formatNumber(enactBlock)
            }
          })}
        </Static>
        <VoteThreshold
          isDisabled
          defaultValue={{ isValid: true, value: value.threshold }}
          label={t('vote threshold')}
          name='voteThreshold'
          type={{
            info: 0,
            type: 'VoteThreshold'
          }}
        />
      </div>
    </ActionItem>
  );
}

export default withMulti(
  styled(Referendum)`
    .democracy--Referendum-results {
      margin-bottom: 1em;

      &.chart {
        text-align: center;
      }
    }
  `,
  translate,
  withCalls<Props>(
    'derive.chain.bestNumber',
    ['derive.democracy.referendumVotesFor', { paramName: 'idNumber' }],
    ['consts.democracy.enactmentPeriod', { fallbacks: ['query.democracy.publicDelay'] }]
  )
);
