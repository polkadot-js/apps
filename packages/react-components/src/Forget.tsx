// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Button from './Button/index.js';
import Modal from './Modal/index.js';
import AddressRow from './AddressRow.js';
import { useTranslation } from './translate.js';

type Mode = 'account' | 'address' | 'contract' | 'code';

interface Props {
  address?: string;
  children?: React.ReactNode;
  name?: string;
  mode?: Mode;
  onClose: () => void;
  onForget: () => void;
}

function getContent (mode: Mode, t: (key: string) => string): React.ReactNode | null {
  switch (mode) {
    case 'account':
      return (
        <>
          <p>{t('You are about to remove this account from your list of available accounts. Once completed, should you need to access it again, you will have to re-create the account either via seed or via a backup file.')}</p>
          <p>{t('This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the account on this browser.')}</p>
        </>
      );
    case 'address':
      return (
        <>
          <p>{t('You are about to remove this address from your address book. Once completed, should you need to access it again, you will have to re-add the address.')}</p>
          <p>{t('This operation does not remove the history of the account from the chain, nor any associated funds from the account. The forget operation only limits your access to the address on this browser.')}</p>
        </>
      );
    case 'contract':
      return (
        <>
          <p>{t('You are about to remove this contract from your list of available contracts. Once completed, should you need to access it again, you will have to manually add the contract\'s address in the Instantiate tab.')}</p>
          <p>{t('This operation does not remove the history of the contract from the chain, nor any associated funds from its account. The forget operation only limits your access to the contract on this browser.')}</p>
        </>
      );
    default:
      return null;
  }
}

function getHeaderText (mode: Mode, t: (key: string) => string): string {
  switch (mode) {
    case 'account':
      return t('Confirm account removal');
    case 'address':
      return t('Confirm address removal');
    case 'contract':
      return t('Confirm contract removal');
    case 'code':
      return t('Confirm code removal');
  }
}

function renderContent (props: Props, t: (key: string) => string): React.ReactNode | null {
  const { address, mode = 'account' } = props;

  switch (mode) {
    case 'account':
    case 'address':
    case 'contract':
      return (
        <AddressRow
          isInline
          value={address || ''}
        >
          {getContent(mode, t)}
        </AddressRow>
      );
    default:
      return null;
  }
}

function Forget (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { children, mode = 'account', onClose, onForget } = props;

  return (
    <Modal
      className='app--accounts-Modal'
      header={getHeaderText(mode, t)}
      onClose={onClose}
    >
      <Modal.Content>{children || renderContent(props, t)}</Modal.Content>
      <Modal.Actions>
        <Button
          icon='trash'
          label={t('Forget')}
          onClick={onForget}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Forget);
