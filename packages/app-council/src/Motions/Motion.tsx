// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Option } from '@polkadot/types';

import { ActionItem, InputAddress, Labelled, Voting } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends I18nProps {
  chain_bestNumber?: BN;
  hash: string;
  proposal: ProposalType | null;
  votes: Votes | null;
}

interface State {
  votedTotal: number;
  votedNay: number;
  votedAye: number;
}

class Motion extends React.PureComponent<Props, State> {
  public state: State = {
    votedTotal: 0,
    votedAye: 0,
    votedNay: 0
  };

  public static getDerivedStateFromProps ({ votes }: Props): State | null {
    if (!votes) {
      return null;
    }

    const { ayes, nays } = votes;

    const newState: State = {
      votedNay: nays.length,
      votedAye: ayes.length,
      votedTotal: ayes.length + nays.length
    };

    return newState;
  }

  public render (): React.ReactNode {
    const { className, hash, proposal, votes } = this.props;

    if (!proposal || !votes) {
      return null;
    }

    const { index } = votes;

    return (
      <ActionItem
        className={className}
        accessory={
          <Voting
            hash={hash}
            isCouncil
            idNumber={index}
            proposal={proposal}
          />
        }
        expandNested
        idNumber={index}
        proposal={proposal}
      >
        {this.renderInfo()}
      </ActionItem>
    );
  }

  private renderInfo (): React.ReactNode {
    const { votes, t } = this.props;

    if (!votes) {
      return null;
    }

    const { ayes, nays, threshold } = votes;

    return (
      <div>
        <h4>
          {t(
            'ayes ({{ayes}}/{{threshold}} to approve)',
            {
              replace: {
                ayes: ayes.length,
                threshold: threshold.toString()
              }
            }
          )}
        </h4>
        {ayes.map((address, index): React.ReactNode => (
          <Labelled
            key={`${index}:${address}`}
            label={t('Aye')}
          >
            <InputAddress
              isDisabled
              value={address}
              withLabel={false}
            />
          </Labelled>
        ))}
        <h4>
          {t(
            'nays ({{nays}})',
            {
              replace: {
                nays: nays.length
              }
            }
          )}
        </h4>
        {nays.map((address, index): React.ReactNode => (
          <Labelled
            key={`${index}:${address}`}
            label={t('Nay')}
          >
            <InputAddress
              isDisabled
              value={address}
              withLabel={false}
            />
          </Labelled>
        ))}
      </div>
    );
  }
}

export default withMulti(
  Motion,
  translate,
  withCalls<Props>(
    [
      'query.council.proposalOf',
      {
        paramName: 'hash',
        propName: 'proposal',
        transform: (value: Option<ProposalType>): ProposalType | null =>
          value.unwrapOr(null)
      }
    ],
    [
      'query.council.voting',
      {
        paramName: 'hash',
        propName: 'votes',
        transform: (value: Option<Votes>): Votes | null =>
          value.unwrapOr(null)
      }
    ]
  )
);
