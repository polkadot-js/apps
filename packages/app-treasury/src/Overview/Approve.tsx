// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { AccountId, BlockNumber } from '@polkadot/types';

import React from 'react';
import { Button, Dropdown } from '@polkadot/ui-app';
import { withMulti, withApi, withCalls } from '@polkadot/ui-api';
import TxModal, { TxModalProps, TxModalState } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

type Props = I18nProps & ApiProps & TxModalProps & {
  isApproved?: boolean,
  proposalInfo?: React.ReactNode,
  proposalId: string,
  threshold: number
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

  txMethod = () => 'councilMotions.propose';
  txParams = () => {
    const { api, proposalId, threshold } = this.props;
    const { isApproving } = this.state;

    const method = isApproving ? 'approveProposal' : 'rejectProposal';
    const spendProposal = api.tx.treasury[method](proposalId);
    return [threshold, spendProposal];
  }

  renderTrigger = () => {
    const { t } = this.props;
    return (
      <div className='ui--Row-buttons'>
        <Button.Group>
          <Button
            isPrimary
            label={t('Respond')}
            labelIcon='reply'
            onClick={this.showModal}
          />
        </Button.Group>
      </div>
    );
  }

  renderPreContent = () => {
    const { proposalInfo = null } = this.props;

    if (!proposalInfo) {
      return null;
    }

    return proposalInfo;
  }

  renderContent = () => {
    const { t } = this.props;
    const { isApproving } = this.state;

    return (
      <Dropdown
        help={t('Propose a majority council motion to either approve or reject this spend proposal')}
        label={t('proposed council action')}
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

export default withMulti(
  Approve,
  translate,
  withApi,
  withCalls(
    [
      'query.council.activeCouncil',
      {
        propName: 'threshold',
        transform: (value: Array<[AccountId, BlockNumber]>) => 1 + (value.length / 2)
      }
    ]
  )
);
