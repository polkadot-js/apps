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
import { AddressRow, Button, Icon, InputBalance, Toggle, TxButton } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {
  voterPositions?: DerivedVoterPositions;
}

interface State extends TxModalState {
  approvals: boolean[] | null;
  oldApprovals: boolean[] | null;
  voteValue: BN;
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

  public static getDerivedStateFromProps ({ electionsInfo: { candidateCount } }: Props, { approvals }: State): Partial<State> | null {
    if (candidateCount && (!approvals || !candidateCount.eq(approvals.length))) {
      return {
        approvals: Vote.emptyApprovals(candidateCount.toNumber())
      };
    }

    return null;
  }

  public constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      approvals: null,
      oldApprovals: null,
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

  protected txParams = (): [boolean[] | null, VoteIndex, BN | null] | [AccountId[], BN] => {
    const { api, electionsInfo: { candidates, nextVoterSet, voteCount }, voterPositions } = this.props;
    const { accountId, approvals, voteValue } = this.state;

    if (api.tx.electionsPhragmen) {
      return [
        candidates.filter((candidate, index): boolean => !!approvals && approvals[index] === true),
        voteValue
      ];
    }

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
    const { accountId, approvals, oldApprovals } = this.state;

    return !accountId ||
      !!oldApprovals ||
      !approvals ||
      !approvals.some((val): boolean => val === true);
  }

  protected renderTrigger = (): React.ReactNode => {
    const { electionsInfo: { candidates }, t } = this.props;

    return (
      <Button
        isDisabled={candidates.length === 0}
        isPrimary
        label={t('Vote')}
        icon='check'
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { api, electionsInfo: { candidates }, voterPositions, t } = this.props;
    const { accountId, approvals, oldApprovals } = this.state;

    return (
      <>
        {api.tx.electionsPhragmen && (
          <InputBalance
            label={t('value')}
            onChange={this.setVoteValue}
          />
        )}
        {(oldApprovals && accountId && voterPositions && voterPositions[accountId]) && (
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
        )}
        <Candidates>
          {approvals && candidates.map((accountId, index): React.ReactNode => {
            const { [index]: isAye } = approvals;

            return (
              <Candidate
                className={isAye ? 'aye' : 'nay'}
                key={accountId.toString()}
              >
                <AddressRow
                  isInline
                  value={accountId}
                >
                  <Toggle
                    isDisabled={!!oldApprovals}
                    label={
                      isAye
                        ? t('Aye')
                        : t('Nay')
                    }
                    onChange={this.onChangeVote(index)}
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

  private emptyApprovals = (): boolean[] => {
    const { electionsInfo: { candidateCount } } = this.props;

    return Vote.emptyApprovals(candidateCount.toNumber());
  }

  private fetchApprovals = (): void => {
    const { api, electionsInfo: { voteCount }, voterPositions } = this.props;
    const { accountId } = this.state;

    if (!accountId || !voteCount) {
      return;
    }

    // FIXME This any is a mismatch in api-derive
    api.derive.elections
      .approvalsOfAt(accountId as any, voteCount)
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

  private onChangeVote = (index: number): (isChecked: boolean) => void =>
    (isChecked: boolean): void => {
      this.setState(({ approvals }: State): Pick<State, never> =>
        approvals
          ? { approvals: approvals.map((b, i): boolean => i === index ? isChecked : (b || false)) }
          : {}
      );
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
  withCalls<Props>(
    ['derive.elections.voterPositions', { propName: 'voterPositions' }]
  )
);
