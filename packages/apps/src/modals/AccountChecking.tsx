// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import styled from 'styled-components';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { I18nProps } from '@polkadot/react-components/types';
import React, { useState } from 'react';
import { Button, Modal, TxComponent } from '@polkadot/react-components';

import { ModalProps } from '../../../app-accounts/src/types';
import translate from '../translate';

interface Props extends ModalProps, I18nProps { }

interface State {
  address: string | null;
  isFileValid: boolean;
  isPassValid: boolean;
  json: KeyringPair$Json | null;
  password: string;
}

const ModalHeader = styled.div`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const Paragraph = styled.div`
  line-height: 1.5rem;
`;

class AccountCheckingModal extends TxComponent<Props, State> {

  public state: State = {
    address: null,
    isFileValid: false,
    isPassValid: false,
    json: null,
    password: ''
  };

  public render (): React.ReactNode {
    const { onClose, t } = this.props;

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isImportOpen, setIsImportOpen] = useState(false);

    const _toggleCreate = (): void => {
      setIsCreateOpen(!isCreateOpen);
      onClose();
    };

    const _toggleImport = (): void => {
      setIsImportOpen(!isImportOpen);
      onClose();
    };

    return (
      <Modal header={t('Welcome to CENNZnet')}>
        <Modal.Content>
          <ModalHeader>{'You don\'t have any accounts'}</ModalHeader>
          <Paragraph>{t('Create or import an account so that you can deposit or withdraw directly from the CENNZnet UI.')}</Paragraph>
          <Paragraph>{t('You will need to have at least one account connected to participate in the network.')}</Paragraph>
        </Modal.Content>
        <Modal.Actions onCancel={onClose} cancelLabel={t('Later')}>
          <Button
            icon='add'
            isPrimary
            onClick={_toggleCreate}
            label={t('Create account')}
          />
          <Button.Or />
          <Button
            icon='sync'
            isPrimary
            onClick={_toggleImport}
            label={t('Import account')}
          />
        </Modal.Actions>
      </Modal>
    );
  }
}

export default translate(AccountCheckingModal);
// export default AccountCheckingModal;
