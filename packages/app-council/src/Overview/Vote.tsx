// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { AccountId, VoteIndex } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { withApi } from '@polkadot/react-api';
import styled from 'styled-components';
import { AddressMini, Button, Toggle } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';
import VoteValue from './VoteValue';

type VoteType = 'member' | 'runnerup' | 'candidate';

interface Props extends ApiProps, ComponentProps, TxModalProps {}

interface State extends TxModalState {
  votes: Record<string, boolean>;
  voteValue: BN;
}

// const MAX_VOTES = 16;

const Candidates = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .candidate {
    border: 1px solid #eee;
    border-radius: 0.25rem;
    margin: 0.25rem;
    padding: 0 0.5rem 0.25rem;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 0;
      right: 0;
      border-color: transparent;
      border-style: solid;
      border-radius: 0.25em;
      border-width: 0.25em;
    }

    &.isAye {
      background: #fff;
      border-color: #ccc;
    }

    &.member::after {
      border-color: green;
    }

    &.runnerup::after {
      border-color: steelblue;
    }

    .ui--AddressMini-icon {
      z-index: 1;
    }

    .candidate-right {
      text-align: right;
    }
  }
`;

class Vote extends TxModal<Props, State> {
  public static emptyApprovals (length: number): boolean[] {
    return [...new Array(length).keys()].map((): boolean => false);
  }

  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      votes: {},
      voteValue: new BN(0)
    };

    this.state = {
      ...this.defaultState
    };
  }

  protected headerText = (): string => this.props.t('Vote for current candidates');

  protected accountLabel = (): string => this.props.t('Voting account');

  protected accountHelp = (): string => this.props.t('This account will be use to approve or disapprove each candidate.');

  protected txMethod = (): string =>
    this.props.api.tx.electionsPhragmen
      ? 'electionsPhragmen.vote'
      : 'elections.vote';

  protected txParams = (): [boolean[] | null, VoteIndex, BN | null] | [string[], BN] => {
    const { votes, voteValue } = this.state;

    return [
      Object
        .entries(votes)
        .filter(([, vote]): boolean => vote)
        .map(([accountId]): string => accountId),
      voteValue
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId, votes } = this.state;
    const hasApprovals = Object.values(votes).some((vote): boolean => vote);

    return !accountId || !hasApprovals;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { electionsInfo: { candidates, members, runnersUp }, t } = this.props;
    const available = members
      .map(([accountId]): AccountId => accountId)
      .concat(runnersUp.map(([accountId]): AccountId => accountId))
      .concat(candidates);

    return (
      <Button
        isDisabled={available.length === 0}
        isPrimary
        label={t('Vote')}
        icon='check'
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { electionsInfo: { candidates, members, runnersUp }, t } = this.props;
    const { accountId, votes } = this.state;
    const _candidates = candidates.map((accountId): [AccountId, VoteType] => [accountId, 'candidate']);
    const available = members
      .map(([accountId]): [AccountId, VoteType] => [accountId, 'member'])
      .concat(runnersUp.map(([accountId]): [AccountId, VoteType] => [accountId, 'runnerup']))
      .concat(_candidates);

    return (
      <>
        <VoteValue
          accountId={accountId}
          onChange={this.setVoteValue}
        />
        <Candidates>
          {available.map(([accountId, type]): React.ReactNode => {
            const key = accountId.toString();
            const isAye = votes[key] || false;

            return (
              <AddressMini
                className={`candidate ${isAye ? 'isAye' : 'isNay'} ${type}`}
                key={key}
                value={key}
              >
                <div className='candidate-right'>
                  <Toggle
                    label={
                      isAye
                        ? t('Aye')
                        : t('Nay')
                    }
                    onChange={this.onChangeVote(key)}
                    value={isAye}
                  />
                </div>
              </AddressMini>
            );
          })}
        </Candidates>
      </>
    );
  }

  private setVoteValue = (voteValue: BN): void => {
    this.setState({ voteValue });
  }

  protected onChangeAccount = (accountId: string | null): void => {
    const { api } = this.props;

    this.setState({ accountId });

    if (accountId) {
      (api.query.electionsPhragmen || api.query.elections)
        .votesOf<[AccountId[]] & Codec>(accountId)
        .then(([existingVotes]): void => {
          existingVotes.forEach((accountId): void => {
            this.onChangeVote(accountId.toString())(true);
          });
        });
    }
  }

  private onChangeVote = (accountId: string): (isChecked: boolean) => void =>
    (isChecked: boolean): void => {
      this.setState(({ votes }: State): Pick<State, never> => ({
        votes: {
          ...votes,
          [accountId]: isChecked
        }
      }));
    }
}

export default translate(withApi(Vote));
