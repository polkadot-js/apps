// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import BN from 'bn.js';
import React from 'react';
import keyring from '@polkadot/ui-keyring';
import { withMulti, withObservable } from '@polkadot/react-api/hoc';

import translate from './translate';
import Button from './Button';
import ProposedAction from './ProposedAction';
import TxModal, { TxModalProps, TxModalState } from './TxModal';
import VoteToggle from './VoteToggle';
import { isTreasuryProposalVote } from './util';

interface Props extends I18nProps, TxModalProps {
  allAccounts?: SubjectInfo;
  hash?: string;
  idNumber: BN | number;
  isCouncil: boolean;
  isDisabled?: boolean;
  proposal?: Proposal | null;
  preContent?: React.ReactNode;
}

interface State extends TxModalState {
  voteValue: boolean;
}

class Voting extends TxModal<Props, State> {
  public state: State;

  protected headerText = (): string => {
    const { isCouncil, t } = this.props;

    return isCouncil ? t('Vote on council proposal') : t('Vote on proposal');
  }

  protected accountLabel = (): string => this.props.t('Vote with account');

  protected accountHelp = (): string => this.props.t('Select the account you wish to vote with. You can approve "aye" or deny "nay" the proposal.');

  protected txMethod = (): string => {
    const { isCouncil } = this.props;

    return isCouncil ? 'council.vote' : 'democracy.vote';
  }

  protected txParams = (): any[] => {
    const { hash, idNumber, isCouncil } = this.props;
    const { voteValue } = this.state;

    return isCouncil
      ? [hash, idNumber, voteValue]
      : [idNumber, voteValue];
  }

  constructor (props: Props) {
    super(props);

    this.state = {
      ...this.defaultState,
      voteValue: true
    };
  }

  protected renderPreContent = (): React.ReactNode => {
    const { idNumber, proposal } = this.props;

    return (
      <>
        <ProposedAction
          expandNested={isTreasuryProposalVote(proposal)}
          idNumber={idNumber}
          isCollapsible
          proposal={proposal}
        />
        <br />
        <br />
      </>
    );
  }

  protected renderContent = (): React.ReactNode => {
    const { voteValue } = this.state;

    return (
      <VoteToggle
        onChange={this.onChangeVote}
        value={voteValue}
      />
    );
  }

  protected renderTrigger = (): React.ReactNode => {
    const { isDisabled, t } = this.props;

    return (
      <div className='ui--Row-buttons'>
        <Button
          isDisabled={isDisabled}
          isPrimary
          label={t('Vote')}
          icon='check'
          onClick={this.showModal}
        />
      </div>
    );
  }

  private onChangeVote = (voteValue: boolean): void => {
    this.setState({ voteValue });
  }
}

export default withMulti(
  Voting,
  translate,
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);
