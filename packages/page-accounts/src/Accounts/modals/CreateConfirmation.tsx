// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { AddressRow, Button, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  address: string;
  isBusy: boolean;
  name: string;
  onClose: () => void;
  onCommit: () => void;
}

function CreateConfirmation ({ address, isBusy, name, onClose, onCommit }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <Modal header={t<string>('Important notice')}>
      <Modal.Content>
        <AddressRow
          defaultName={name}
          isInline
          noDefaultNameOpacity
          value={address}
        >
          <p>{t<string>('We will provide you with a generated backup file after your account is created. As long as you have access to your account you can always download this file later by clicking on "Backup" button from the Accounts section.')}</p>
          <p>{t<string>('Please make sure to save this file in a secure location as it is required, together with your password, to restore your account.')}</p>
        </AddressRow>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          icon='plus'
          isBusy={isBusy}
          label={t<string>('Create and backup account')}
          onClick={onCommit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(CreateConfirmation);
