// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ElectionsInfo } from './types';

import React from 'react';
import { Button } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

type Props = TxModalProps & {
  electionsInfo: ElectionsInfo
};

type State = TxModalState;

class SubmitCandidacy extends TxModal<Props, State> {
  headerText = () => this.props.t('Submit your council candidacy');

  accountLabel = () => this.props.t('Candidate account');
  accountHelp = () => this.props.t('This account will be nominated to fill the council slot you specify.');

  txMethod = () => 'elections.submitCandidacy';
  txParams = () => {
    const { electionsInfo: { candidateCount } } = this.props;

    return [
      candidateCount
    ];
  }

  isDisabled = () => {
    const { accountId } = this.state;

    return !accountId;
  }

  renderTrigger = () => {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isPrimary
          label={t('Submit candidacy')}
          labelIcon='add'
          onClick={this.showModal}
        />
      </Button.Group>
    );
  }
}

export default translate(SubmitCandidacy);
