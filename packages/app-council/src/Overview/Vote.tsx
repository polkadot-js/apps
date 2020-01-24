// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { AccountId, VoteIndex } from '@polkadot/types/interfaces';
import { Codec } from '@polkadot/types/types';
import { ComponentProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { withApi } from '@polkadot/react-api/hoc';
import { AddressMulti, Button } from '@polkadot/react-components';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';
import VoteValue from './VoteValue';

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
    const { accountId, votes } = this.state;

    return !accountId || votes.length === 0;
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
        <AddressMulti
          available={available}
          help={t('Filter available candidates based on name, address or short account index.')}
          label={t('filter candidates')}
          maxCount={MAX_VOTES}
          onChange={this.onChangeVotes}
          value={votes}
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
        .votesOf<[AccountId[]] & Codec>(accountId)
        .then(([existingVotes]): void => {
          const { electionsInfo: { candidates, members, runnersUp } } = this.props;
          const available = members
            .map(([accountId]): string => accountId.toString())
            .concat(runnersUp.map(([accountId]): string => accountId.toString()))
            .concat(candidates.map((accountId): string => accountId.toString()));

          this.setState({
            votes: existingVotes
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
