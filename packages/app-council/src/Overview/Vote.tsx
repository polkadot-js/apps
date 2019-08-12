// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteIndex } from '@polkadot/types/interfaces';
import { DerivedVoterPositions } from '@polkadot/api-derive/types';
import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { createType } from '@polkadot/types';
import { withApi, withCalls, withMulti } from '@polkadot/react-api';
import { AddressRow, Button, Icon, Toggle, TxButton } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {
  voterPositions?: DerivedVoterPositions;
}

interface State extends TxModalState {
  approvals: boolean[] | null;
  oldApprovals: boolean[] | null;
  // voterPositions: DerivedVoterPositions;
}

const AlreadyVoted = styled.article`
  display: flex;
  align-items: center;
  margin: 0.5rem 0;

  & > :first-child {
    flex: 1 1;
  }

  & > :not(:first-child) {
    margin: 0;
  }
`;

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
  padding: 0.5rem;
  margin: 0.5rem;
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
`;

class Vote extends TxModal<Props, State> {
  public static emptyApprovals (length: number): boolean[] {
    return [...new Array(length).keys()].map((): boolean => false);
  }

  public static getDerivedStateFromProps ({ electionsInfo: { candidateCount } }: Props, { approvals }: State): Partial<State> {
    const state: Partial<State> = {};
    // if (voterPositions) {
    //   state.voters = Object.keys(voterSets).reduce(
    //     (result: Record<string, VoterPosition>, accountId, globalIndex): Record<string, VoterPosition> => {
    //       result[accountId] = {
    //         setIndex: voterSets[accountId],
    //         globalIndex: new BN(globalIndex)
    //       };
    //       return result;
    //     },
    //     {}
    //   );
    // }

    if (candidateCount && !approvals) {
      state.approvals = state.oldApprovals || Vote.emptyApprovals(candidateCount.toNumber());
    }

    return state;
  }

  public constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      approvals: null,
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

  protected txParams = (): [boolean[] | null, VoteIndex, BN | null] => {
    const { electionsInfo: { nextVoterSet, voteCount }, voterPositions } = this.props;
    const { accountId, approvals } = this.state;

    return [
      approvals ? approvals.slice(0, 1 + approvals.lastIndexOf(true)) : [],
      createType('VoteIndex', voteCount),
      voterPositions && accountId && voterPositions[accountId]
        ? voterPositions[accountId].setIndex
        : nextVoterSet
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId, oldApprovals } = this.state;

    return !accountId || !!oldApprovals;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { electionsInfo: { candidates }, t } = this.props;

    return (
      <Button
        isDisabled={candidates.length === 0}
        isPrimary
        label={t('Vote')}
        labelIcon='check'
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { electionsInfo: { candidates }, voterPositions, t } = this.props;
    const { accountId, approvals, oldApprovals } = this.state;

    return (
      <>
        {
          (oldApprovals && accountId && voterPositions && voterPositions[accountId]) && (
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
                  labelIcon='delete'
                  onSuccess={this.onRetractVote}
                  params={[voterPositions[accountId].globalIndex]}
                  tx='elections.retractVoter'
                />
              </Button.Group>
            </AlreadyVoted>
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
                  {...(
                    !oldApprovals
                      ? { onClick: (): void => this.onChangeVote(index)() }
                      : {}
                  )}
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
    const { approvals, oldApprovals } = this.state;

    if (!approvals) {
      return null;
    }

    const { [index]: bool } = approvals;

    return (
      <Toggle
        isDisabled={!!oldApprovals}
        label={
          bool
            ? (
              <b>{t('Aye')}</b>
            )
            : (
              <b>{t('No vote')}</b>
            )
        }
        value={bool}
      />
    );
  }

  private emptyApprovals = (): boolean[] => {
    const { electionsInfo: { candidateCount } } = this.props;

    return Vote.emptyApprovals(candidateCount.toNumber());
  }

  private fetchApprovals = (): void => {
    const { api, electionsInfo: { voteCount }, voterPositions } = this.props;
    const { accountId } = this.state;

    if (!accountId) {
      return;
    }

    api.derive.elections.approvalsOfAt(accountId, voteCount)
      .then((approvals: boolean[]): void => {
        if ((voterPositions && voterPositions[accountId.toString()]) && approvals && approvals.length && approvals !== this.state.approvals) {
          this.setState({
            approvals,
            oldApprovals: approvals
          });
        } else {
          this.setState({
            approvals: this.emptyApprovals()
          });
        }
      });
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

  private onRetractVote = (): void => {
    this.setState({
      approvals: this.emptyApprovals(),
      oldApprovals: null
    });
  }
}

export default withMulti(
  Vote,
  translate,
  withApi,
  withCalls<Props>(
    ['derive.elections.voterPositions', { propName: 'voterPositions' }]
  )
);
