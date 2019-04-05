// Copyright 2017-2019 @polkadot/ui-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Button, InputAddress, Modal, TxButton } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  accountId: string,
  isOpen: boolean,
  onClose: () => void
};

type State = {};

class Key extends React.PureComponent<Props, State> {
  state: State = {};

  render () {
    const { accountId, isOpen, onClose, t } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        className='staking--Stash'
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
            label={t('Set Session Key')}
            onClick={onClose}
            params={[accountId]}
            tx='session.setKey'
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
          {t('Key Preferences')}
        </Modal.Header>
        <Modal.Content className='ui--signer-Signer-Content'>
          <InputAddress
            className='medium'
            help={t('Changing the key only takes effect at the start of the next session.')}
            isDisabled
            label={t('session key')}
            value={accountId}
          />
        </Modal.Content>
      </>
    );
  }
}

export default translate(Key);
