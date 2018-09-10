// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringPair } from '@polkadot/util-keyring/types';
import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import AddressSummary from '@polkadot/ui-app/AddressSummary';

import translate from './translate';

type Props = I18nProps & {
  isOpen: boolean,
  onClose: () => void,
  doForget: () => void,
  currentAddress: KeyringPair | null
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
            text={t('forget.close', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={doForget}
            text={t('forget.forget', {
              defaultValue: 'Forget'
            })}
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
        {t('forget.header', {
          defaultValue: 'Confirm account removal'
        })}
      </Modal.Header>,
      <Modal.Content className='forgetting--Account' key='content'>
        <AddressSummary
          className='ui--AddressSummary-base'
          value={address || ''}
        />
      </Modal.Content>
    ];
  }
}

export default translate(Forgetting);
