// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@polkadot/app-contracts/types';

import React from 'react';
import { AddressRow, Button, CodeRow, Modal } from '@polkadot/react-components';

import { useTranslation } from './translate';

type Mode = 'account' | 'address' | 'contract' | 'code';

interface Props {
  address?: string;
  code?: CodeStored;
  name?: string;
  mode?: Mode;
  onClose: () => void;
  onForget: () => void;
}

function getContent (mode: Mode, t: (key: string) => string): React.ReactNode {
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
    case 'code':
      return (
        <>
          <p>{t('You are about to remove this code from your list of available code hashes. Once completed, should you need to access it again, you will have to manually add the code hash again.')}</p>
          <p>{t('This operation does not remove the uploaded code WASM and ABI from the chain, nor any deployed contracts. The forget operation only limits your access to the code on this browser.')}</p>
        </>
      );
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

function renderContent (props: Props, t: (key: string) => string): React.ReactNode {
  const { address, code, mode = 'account' } = props;

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
    case 'code':
      return (
        <CodeRow
          isInline
          code={code || ''}
        >
          {getContent(mode, t)}
        </CodeRow>
      );
  }
}

export default function Forget (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { mode = 'account', onForget, onClose } = props;

  return (
    <Modal
      className='app--accounts-Modal'
      header={getHeaderText(mode, t)}
      onClose={onClose}
    >
      <Modal.Content>{renderContent(props, t)}</Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <Button
          isPrimary
          onClick={onForget}
          label={t('Forget')}
          icon='trash'
        />
      </Modal.Actions>
    </Modal>
  );
}
