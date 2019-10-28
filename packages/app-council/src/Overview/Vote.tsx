// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, VoteIndex } from '@polkadot/types/interfaces';
import { DerivedVoterPositions } from '@polkadot/api-derive/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { createType } from '@polkadot/types';
import { withCalls, withMulti } from '@polkadot/react-api';
import { AddressRow, Button, InputBalance, Toggle } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {
  voterPositions?: DerivedVoterPositions;
}

interface State extends TxModalState {
  votes: Record<string, boolean>;
  voteValue: BN;
  // voterPositions: DerivedVoterPositions;
}

// const AlreadyVoted = styled.article`
//   display: flex;
//   align-items: center;
//   margin: 0.5rem 0;

//   & > :first-child {
//     flex: 1 1;
//   }

//   & > :not(:first-child) {
//     margin: 0;
//   }
// `;

const Candidates = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Candidate = styled.div`
  cursor: pointer;
  width: 25rem;
  min-width: calc(50% - 1rem);
  border-radius: 0.5rem;
  border: 1px solid #eee;
  padding: 0.75rem 0.5rem 0.25rem;
  margin: 0.25rem;
  transition: all 0.2s;

  b {
    min-width: 5rem;
  }

  &.aye {
    background-color: rgba(0, 255, 0, 0.05);

    b {
      color: green;
    }
  }

  &.nay {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .ui--Row-children {
    text-align: right;
    width: 100%;
  }
`;

class Vote extends TxModal<Props, State> {
  public static emptyApprovals (length: number): boolean[] {
    return [...new Array(length).keys()].map((): boolean => false);
  }

  public constructor (props: Props) {
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

  public componentDidMount (): void {
    this.fetchApprovals();
  }

  public componentDidUpdate (_: Props, prevState: State): void {
    const { accountId } = this.state;

    if (accountId !== prevState.accountId) {
      this.fetchApprovals();
    }
  }

  protected headerText = (): string => this.props.t('Vote for current candidates');

  protected accountLabel = (): string => this.props.t('Voting account');

  protected accountHelp = (): string => this.props.t('This account will be use to approve or disapprove each candidate.');

  protected txMethod = (): string =>
    this.props.api.tx.electionsPhragmen
      ? 'electionsPhragmen.vote'
      : 'elections.setApprovals';

  protected txParams = (): [boolean[] | null, VoteIndex, BN | null] | [string[], BN] => {
    const { api, electionsInfo: { candidates, nextVoterSet, voteCount }, voterPositions } = this.props;
    const { accountId, votes, voteValue } = this.state;

    if (api.tx.electionsPhragmen) {
      return [
        Object.entries(votes).filter(([, vote]): boolean => vote).map(([accountId]): string => accountId),
        voteValue
      ];
    }

    const approvals = candidates.map((accountId): boolean => votes[accountId.toString()] === true);

    return [
      approvals
        ? approvals.slice(0, 1 + approvals.lastIndexOf(true))
        : [],
      createType('VoteIndex', voteCount),
      voterPositions && accountId && voterPositions[accountId]
        ? voterPositions[accountId].setIndex
        : nextVoterSet || null
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId, votes } = this.state;
    const hasApprovals = Object.values(votes).some((vote): boolean => vote);

    return !accountId || !hasApprovals;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { api, electionsInfo: { candidates, members }, t } = this.props;
    const available = api.tx.electionsPhragmen
      ? members.concat(candidates)
      : candidates;

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
    const { api, electionsInfo: { candidates, members }, t } = this.props;
    const { votes } = this.state;
    const _candidates = candidates.map((accountId): [AccountId, boolean] => [accountId, false]);
    const available = api.tx.electionsPhragmen
      ? members.map((accountId): [AccountId, boolean] => [accountId, true]).concat(_candidates)
      : _candidates;

    return (
      <>
        {api.tx.electionsPhragmen && (
          <InputBalance
            label={t('value')}
            onChange={this.setVoteValue}
          />
        )}
        {/* {(oldApprovals && accountId && voterPositions && voterPositions[accountId]) && (
          <AlreadyVoted className='warning padded'>
            <div>
              <Icon name='warning sign' />
              {t('You have already voted in this round')}
            </div>
            <Button.Group>
              <TxButton
                accountId={accountId}
                isNegative
                label={t('Retract vote')}
                icon='delete'
                onSuccess={this.onRetractVote}
                params={[voterPositions[accountId].globalIndex]}
                tx='elections.retractVoter'
              />
            </Button.Group>
          </AlreadyVoted>
        )} */}
        <Candidates>
          {available.map(([accountId, isMember]): React.ReactNode => {
            const key = accountId.toString();
            const isAye = votes[key] || false;

            return (
              <Candidate
                className={isAye ? 'aye' : 'nay'}
                key={key}
              >
                <AddressRow
                  defaultName={isMember ? t('member') : t('candidate')}
                  isInline
                  value={accountId}
                  withIndexOrAddress
                >
                  <Toggle
                    label={
                      isAye
                        ? t('Aye')
                        : t('Nay')
                    }
                    onChange={this.onChangeVote(key)}
                    value={isAye}
                  />
                </AddressRow>
              </Candidate>
            );
          })}
        </Candidates>
      </>
    );
  }

  private setVoteValue = (voteValue?: BN): void => {
    this.setState({ voteValue: voteValue || new BN(0) });
  }

  private fetchApprovals = (): void => {
    const { api, electionsInfo: { candidates, voteCount } } = this.props;
    const { accountId } = this.state;

    if (!accountId || !voteCount) {
      return;
    }

    // FIXME This any is a mismatch in api-derive
    api.derive.elections
      .approvalsOfAt(accountId as any, voteCount)
      .then((approvals: boolean[]): void => {
        this.setState({
          votes: candidates.reduce((votes: Record<string, boolean>, accountId, index): Record<string, boolean> => ({
            ...votes,
            [accountId.toString()]: approvals[index] || false
          }), {})
        });
      });
  }

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState({ accountId });
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

export default withMulti(
  Vote,
  translate,
  withCalls<Props>(
    ['derive.elections.voterPositions', { propName: 'voterPositions' }]
  )
);
