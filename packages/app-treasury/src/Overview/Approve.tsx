// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Dropdown } from '@polkadot/ui-app';
import TxModal, { TxModalProps, TxModalState } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

type Props = I18nProps & TxModalProps & {
  isApproved?: boolean,
  proposalInfo?: React.ReactNode,
  proposalId: string
};

type State = TxModalState & {
  isApproving: boolean
};

class Approve extends TxModal<Props, State> {
  state: State = {
    ...this.defaultState,
    isApproving: false
  };

  private approveOptions = () => [
    { text: this.props.t('Aye, I approve'), value: true },
    { text: this.props.t('Nay, I do not approve'), value: false }
  ]

  headerText = () => this.props.t('Approve or reject proposal');

  txMethod = () => this.state.isApproving ? 'treasury.approveProposal' : 'treasury.rejectProposal';
  txParams = () => [this.props.proposalId];

  renderPreContent = () => {
    const { proposalInfo = null } = this.props;

    return (
      <>
        {proposalInfo}
        <br />
        <br />
      </>
    );
  }

  renderContent = () => {
    const { t } = this.props;
    const { isApproving } = this.state;

    return (
      <Dropdown
        help={t('Select your vote preference for this spend proposal, either to approve or disapprove')}
        label={t('action')}
        options={this.approveOptions()}
        onChange={this.onChangeApproving}
        value={isApproving}
      />
    );
  }

  private onChangeApproving = (isApproving: boolean) => {
    this.setState({ isApproving });
  }
}

export default translate(Approve);
