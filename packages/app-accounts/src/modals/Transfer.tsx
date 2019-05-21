// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import React from 'react';
import { AddressRow, Button, Modal } from '@polkadot/ui-app';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';

type Props = I18nProps & {
  onClose: () => void,
  address: string
};

class Transfer extends React.PureComponent<Props> {
  render () {
    return (
      <Modal
        className='app--accounts-Modal'
        dimmer='inverted'
        open
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { onClose, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <Button
            /*isDisabled={}*/
            isPrimary
            label={t('Download')}
            onClick={this.doBackup}
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
          {t('Backup account')}
        </Modal.Header>
        <Modal.Content className='app--account-Backup-content'>
          <AddressRow
            isInline
            value={address}
          >
            <p>{t('An encrypted backup file will be created once you have pressed the "Download" button. This can be used to re-import your account on any other machine.')}</p>
            <p>{t('Save this backup file in a secure location. Additionally, the password associated with this account is needed together with this backup file in order to restore your account.')}</p>
            <div>

            </div>
          </AddressRow>
        </Modal.Content>
      </>
    );
  }

  private doBackup = (): void => {

    onClose();
  }

}

export default translate(Transfer);
