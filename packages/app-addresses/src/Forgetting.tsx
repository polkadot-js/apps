// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringAddress } from '@polkadot/ui-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressSummary, Button, Modal } from '@polkadot/ui-app/index';

import translate from './translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void,
  doForget: () => void,
  currentAddress: KeyringAddress | null
};

class Forgetting extends React.PureComponent<Props> {
  constructor (props: Props) {
    super(props);
  }

  render () {
    const { isOpen, style } = this.props;

    if (!isOpen) {
      return null;
    }

    return (
      <Modal
        size='tiny'
        dimmer='inverted'
        open
        style={style}
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  renderButtons () {
    const { onClose, doForget, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onClose}
            text={t('Cancel')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={doForget}
            text={t('Forget')}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent () {
    const { t, currentAddress } = this.props;

    const address = currentAddress
      ? currentAddress.address()
      : undefined;

    return [
      <Modal.Header key='header'>
        {t('Confirm address removal')}
      </Modal.Header>,
      <Modal.Content className='forgetting-Address' key='content'>
        <AddressSummary
          className='ui--AddressSummary-base'
          value={address || ''}
        />
      </Modal.Content>
    ];
  }
}

export default translate(Forgetting);
