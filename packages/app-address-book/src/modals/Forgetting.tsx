// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressRow, Button, Modal } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  onClose: () => void,
  doForget: () => void,
  currentAddress: KeyringAddress | null
};

class Forgetting extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { style, t } = this.props;

    return (
      <Modal
        dimmer='inverted'
        open
        style={style}
      >
        <Modal.Header>{t('Confirm address removal')}</Modal.Header>
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { onClose, doForget, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={doForget}
            label={t('Forget')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { t, currentAddress } = this.props;

    const address = currentAddress
      ? currentAddress.address()
      : undefined;

    return (
      <Modal.Content className='forgetting-Address'>
        <AddressRow
          isInline
          value={address || ''}
        >
          <p>{t('You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.')}</p>
          <p>{t('This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.')}</p>
        </AddressRow>
      </Modal.Content>
    );
  }
}

export default translate(Forgetting);
