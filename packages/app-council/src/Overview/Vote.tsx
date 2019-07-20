// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, SetIndex, VoteIndex } from '@polkadot/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { withApi, withCalls, withMulti } from '@polkadot/ui-api';
import { AddressRow, Button, Icon, Toggle } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {
  voters?: Record<string, SetIndex>;
  voters2?: AccountId[];
}

interface State extends TxModalState {
  approvals: boolean[] | null;
  hint: BN;
  oldApprovals: boolean[] | null;
}

const Candidates = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const Candidate = styled.div`
  cursor: pointer;
  min-width: calc(50% - 1rem);
  border-radius: 0.5rem;
  border: 1px solid #eee;
  padding: 0.5rem;
  margin: 0.5rem;
  transition: all 0.2s;

  &.aye {
    background-color: rgba(0, 255, 0, 0.05);
  }

  &.nay {
    background-color: rgba(255, 0, 0, 0.05);
  }
`;

class Vote extends TxModal<Props, State> {
  public static getDerivedStateFromProps ({ electionsInfo: { candidateCount }, voters }: Props, { accountId, approvals }: State): Partial<State> {
    const state: Partial<State> = {};
    if (accountId && voters && voters[accountId]) {
      state.hint = new BN(voters[accountId]);
    }
    if (candidateCount && (!approvals || approvals.length !== candidateCount.toNumber())) {
      state.approvals = state.oldApprovals || [...new Array(candidateCount.toNumber()).keys()].map((): boolean => false);
    }
    return state;
  }

  public constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      approvals: null,
      hint: new BN(0),
      oldApprovals: null
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

  protected txMethod = (): string => 'elections.setApprovals';

  protected txParams = (): [boolean[] | null, VoteIndex, BN] => {
    const { electionsInfo: { voteCount } } = this.props;
    const { approvals, hint } = this.state;

    return [
      approvals, new VoteIndex(voteCount), hint
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId || this.areVotesUnchanged();
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button
        isPrimary
        label={t('Vote')}
        labelIcon='check'
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { electionsInfo: { candidates }, t } = this.props;
    const { approvals, oldApprovals } = this.state;

    return (
      <>
        {
          oldApprovals && (
            <article
              className='warning padded'
              style={{
                display: 'flex',
                alignItems: 'center',
                margin: '0.5rem 0'
              }}
            >
              <div style={{ flex: '1 1' }}>
                <Icon name='warning sign' />
                {t('You have already voted in this round')}
              </div>
              <Button.Group style={{ margin: 0 }}>
                <Button
                  isDisabled={this.areVotesUnchanged()}
                  isPrimary
                  label={t('Reset votes')}
                  onClick={this.onResetVotes}
                />
              </Button.Group>
            </article>
          )
        }
        <Candidates>
          {
            candidates.map((accountId, index): React.ReactNode => {
              if (!approvals) {
                return null;
              }
              const { [index]: isAye } = approvals;
              return (
                <Candidate
                  className={isAye ? 'aye' : 'nay'}
                  key={accountId.toString()}
                  onClick={(): void => this.onChangeVote(index)()}
                >
                  <AddressRow
                    isInline
                    value={accountId}
                  >
                    {this.renderToggle(index)}
                  </AddressRow>
                </Candidate>
              );
            })
          }
        </Candidates>
      </>
    );
  }

  private renderToggle = (index: number): React.ReactNode => {
    const { t } = this.props;
    const { approvals } = this.state;

    if (!approvals) {
      return null;
    }

    const { [index]: bool } = approvals;

    return (
      <Toggle
        label={
          bool
            ? (
              <b style={{ color: 'green' }}>
                {t('Aye')}
              </b>
            )
            : (
              <b style={{ color: 'red' }}>
                {t('Nay')}
              </b>
            )
        }
        value={bool}
      />
    );
  }

  private fetchApprovals = (): void => {
    const { api, electionsInfo: { voteCount } } = this.props;
    const { accountId } = this.state;

    if (!accountId) {
      return;
    }

    api.derive.elections.approvalsOfAt(accountId, voteCount)
      .then((approvals: boolean[]): void => {
        if (approvals && approvals.length && approvals !== this.state.approvals) {
          this.setState({
            approvals,
            oldApprovals: approvals
          });
        }
      });
  }

  private areVotesUnchanged = (): boolean => {
    const { approvals, oldApprovals } = this.state;

    if (!approvals || !oldApprovals) {
      return false;
    }

    return approvals.reduce(
      (bool, vote, at): boolean => bool && vote === oldApprovals[at],
      true
    );
  }

  protected onChangeAccount = (accountId: string | null): void => {
    this.setState({
      accountId,
      oldApprovals: null
    });
  }

  private onChangeVote = (index: number): (isChecked?: boolean) => void =>
    (isChecked?: boolean): void => {
      this.setState(({ approvals }: State): Pick<State, never> => {
        if (!approvals) {
          return {};
        }
        return {
          approvals: approvals.map((b, i): boolean => i === index ? isChecked || !approvals[index] : b)
        };
      });
    }

  private onResetVotes = (): void => {
    this.setState(({ oldApprovals }: State): Pick<State, never> => {
      return {
        approvals: oldApprovals
      };
    });
  }
}

export default withMulti(
  Vote,
  translate,
  withApi,
  withCalls<Props>(
    ['derive.elections.voterSets', { propName: 'voters' }]
  )
);
