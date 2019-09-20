// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressRow, Button, Modal } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  address: string;
  name: string;
  onCommit: () => void;
  onHideWarning: () => void;
}

function CreateConfirmation ({ address, name, onCommit, onHideWarning, t }: Props): React.ReactElement<Props> | null {
  return (
    <Modal
      dimmer='inverted'
      open
    >
      <Modal.Header>
        {t('Important notice')}
      </Modal.Header>
      <Modal.Content>
        <AddressRow
          defaultName={name}
          isInline
          value={address}
        >
          <p>{t('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
          <p>{t('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            label={t('Cancel')}
            labelIcon='cancel'
            onClick={onHideWarning}
          />
          <Button.Or />
          <Button
            isPrimary
            label={t('Create and backup account')}
            labelIcon='plus'
            onClick={onCommit}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(CreateConfirmation);
