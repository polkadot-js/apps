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
  isApproving: boolean | null,
  proposalInfo?: React.ReactNode,
  proposalId: string
};

type State = TxModalState & {
  isApproving: boolean | null
};

class Approve extends TxModal<Props, State> {

  private approveOptions = [
    { text: 'Yay, I approve', value: true },
    { text: 'Nay, I do not approve', value: false }
  ];

  static getDerivedStateFromProps ({ isApproving }: Props, state: State) {
    if (isApproving === null || state.isApproving === null) {
      return { isApproving };
    }
    return {};
  }

  state: State = this.defaultState;

  headerText = 'Approve or reject proposal';

  txMethod = () => {
    const { isApproving } = this.state;

    return isApproving ? 'treasury.approveProposal' : 'treasury.rejectProposal';
  }

  txParams = () => {
    const { proposalId } = this.props;

    return [proposalId];
  }

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
        options={this.approveOptions.map((option) => ({ ...option, text: t(option.text) }))}
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
