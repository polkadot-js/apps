// Copyright 2017-2020 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { ComponentProps } from './types';

import React from 'react';
import { withApi } from '@polkadot/react-api/hoc';
import { Button } from '@polkadot/react-components';
import TxModal, { TxModalState as State, TxModalProps } from '@polkadot/react-components/TxModal';

import translate from '../translate';

interface Props extends ApiProps, ComponentProps, TxModalProps {}

class SubmitCandidacy extends TxModal<Props, State> {
  protected headerText = (): string => this.props.t('Submit your council candidacy');

  protected accountLabel = (): string => this.props.t('Candidate account');

  protected accountHelp = (): string => this.props.t('This account will be nominated to fill the council slot you specify.');

  protected txMethod = (): string =>
    this.props.api.tx.electionsPhragmen
      ? 'electionsPhragmen.submitCandidacy'
      : 'elections.submitCandidacy';

  protected txParams = (): [] => [];

  protected isDisabled = (): boolean => {
    const { accountId } = this.state;

    return !accountId;
  }

  protected renderTrigger = (): React.ReactNode => {
    const { t } = this.props;

    return (
      <Button
        label={t('Submit candidacy')}
        icon='add'
        onClick={this.showModal}
      />
    );
  }
}

export default translate(withApi(SubmitCandidacy));
