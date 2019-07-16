// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ElectionsInfo } from './types';

import BN from 'bn.js';
import React from 'react';
import { Button } from '@polkadot/ui-app';
import TxModal, { TxModalState, TxModalProps } from '@polkadot/ui-app/TxModal';

import translate from '../translate';

interface Props extends TxModalProps {
  electionsInfo: ElectionsInfo;
}

type State = TxModalState;

class SubmitCandidacy extends TxModal<Props, State> {
  protected headerText = (): string => this.props.t('Submit your council candidacy');

  protected accountLabel = (): string => this.props.t('Candidate account');

  protected accountHelp = (): string => this.props.t('This account will be nominated to fill the council slot you specify.');

  protected txMethod = (): string => 'elections.submitCandidacy';

  protected txParams = (): [BN] => {
    const { electionsInfo: { candidateCount } } = this.props;

    return [
      candidateCount
    ];
  }

  protected isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId;
  }

  protected renderTrigger = (): React.ReactNode => {
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
