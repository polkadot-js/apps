// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { AccountId, VoteIndex } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { withApi } from '@polkadot/react-api/hoc';
import { Button, InputAddressMulti, VoteValue } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {}

interface State extends TxModalState {
  votes: string[];
  voteValue: BN;
}

const MAX_VOTES = 16;

class Vote extends TxModal<Props, State> {
  constructor (props: Props) {
    super(props);

    this.defaultState = {
      ...this.defaultState,
      votes: [],
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

    return [votes, voteValue];
  }

  protected isDisabled = (): boolean => {
    const { accountId, votes, voteValue } = this.state;

    return !accountId || votes.length === 0 || voteValue.lten(0);
  }

  protected renderTrigger = (): React.ReactNode => {
    let available: AccountId[] = [];

    if (this.props.electionsInfo) {
      const { electionsInfo: { candidates, members, runnersUp } } = this.props;

      available = members
        .map(([accountId]): AccountId => accountId)
        .concat(runnersUp.map(([accountId]): AccountId => accountId))
        .concat(candidates);
    }

    return (
      <Button
        isDisabled={available.length === 0}
        label={this.props.t('Vote')}
        icon='check'
        onClick={this.showModal}
      />
    );
  }

  protected renderContent = (): React.ReactNode => {
    if (!this.props.electionsInfo) {
      return null;
    }

    const { electionsInfo: { candidates, members, runnersUp }, t } = this.props;
    const { accountId, votes } = this.state;
    const available = members
      .map(([accountId]): string => accountId.toString())
      .concat(runnersUp.map(([accountId]): string => accountId.toString()))
      .concat(candidates.map((accountId): string => accountId.toString()));

    return (
      <>
        <VoteValue
          accountId={accountId}
          onChange={this.setVoteValue}
        />
        <InputAddressMulti
          available={available}
          availableLabel={t('council candidates')}
          help={t('Select and order council candidates you wish to vote for.')}
          maxCount={MAX_VOTES}
          onChange={this.onChangeVotes}
          value={votes}
          valueLabel={t('my ordered votes')}
        />
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
        .votesOf<([AccountId[]] & Codec) | AccountId[]>(accountId)
        .then((existingVotes): void => {
          if (!this.props.electionsInfo) {
            return;
          }

          const { electionsInfo: { candidates, members, runnersUp } } = this.props;
          const available = members
            .map(([accountId]): string => accountId.toString())
            .concat(runnersUp.map(([accountId]): string => accountId.toString()))
            .concat(candidates.map((accountId): string => accountId.toString()));

          this.setState({
            votes: (
              Array.isArray(existingVotes[0])
                ? existingVotes[0]
                : (existingVotes as AccountId[])
            )
              .map((accountId): string => accountId.toString())
              .filter((accountId): boolean => available.includes(accountId))
          });
        });
    }
  }

  private onChangeVotes = (votes: string[]): void => {
    this.setState({ votes });
  }
}

export default translate(withApi(Vote));
