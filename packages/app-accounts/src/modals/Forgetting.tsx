// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressRow, Button, Modal } from '@polkadot/ui-app';

import translate from '../translate';

type Props = I18nProps & {
  address: string,
  onClose: () => void,
  doForget: () => void
};

class Forgetting extends React.PureComponent<Props> {
  render () {

    return (
      <Modal
        className='accounts--Forgetting-Modal'
        dimmer='inverted'
        open
      >
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
    const { address, t } = this.props;

    return (
      <>
        <Modal.Header>
          {t('Confirm account removal')}
        </Modal.Header>
        <Modal.Content>
          <AddressRow
            isInline
            value={address}
          >
            <p>{t('You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.')}</p>
            <p>{t('This operaion does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.')}</p>
          </AddressRow>
        </Modal.Content>
      </>
    );
  }
}

export default translate(Forgetting);
