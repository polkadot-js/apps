// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';
import { I18nProps } from '@polkadot/ui-app/types';
import React from 'react';

import translate from '../translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void
};

class Undelegate extends React.PureComponent<Props, State> {
  render () {
    const { accountId, isOpen, onClose, t } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='democracy--Undelegate'
        dimmer='inverted'
        open
        size='small'
      >
        {this.renderContent()}
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={onClose}
              label={t('Cancel')}
            />
            <Button.Or />
            <TxButton
              accountId={accountId}
              isPrimary
              label={t('Undelegate')}
              onClick={onClose}
              tx='democracy.undelegate'
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  private renderContent () {
    const { accountId, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Undelegate')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            defaultValue={accountId}
            isDisabled
            label={t('delegator account')}
          />
        </Modal.Content>
      </>
    );
  }
}

export default translate(Undelegate);
