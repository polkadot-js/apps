// Copyright 2017-2023 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveAccountInfo } from '@polkadot/api-derive/types';
import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { ModalProps as Props } from '../types.js';

import React, { useCallback, useRef, useState } from 'react';

import { AddressRow, Button, Input, InputAddress, Modal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { useTranslation } from '../translate.js';
import { getAddressFromDomain, getValidatedAddress } from '../util.js';

interface AddrState {
  address: string;
  addressInput: string;
  isAddressExisting: boolean;
  isAddressValid: boolean;
}

interface NameState {
  isNameValid: boolean;
  name: string;
}

function Create ({ onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isEthereum, systemChain } = useApi();
  const [{ isNameValid, name }, setName] = useState<NameState>({ isNameValid: false, name: '' });
  const [{ address, addressInput, isAddressExisting, isAddressValid }, setAddress] = useState<AddrState>({ address: '', addressInput: '', isAddressExisting: false, isAddressValid: false });
  const latestAddressInput = useRef(address);
  const info = useCall<DeriveAccountInfo>(!!address && isAddressValid && api.derive.accounts.info, [address]);
  const isValid = (isAddressValid && isNameValid) && !!info?.accountId;

  const _onChangeAddressAsync = useCallback(
    async (input: string): Promise<void> => {
      latestAddressInput.current = input;

      let address: string | null | undefined = getValidatedAddress(input, isEthereum);
      let isAddressExisting = false;

      if (!address) {
        address = await getAddressFromDomain(input, { api, systemChain });
      }

      if (address) {
        const old = keyring.getAddress(address);

        if (old) {
          const newName = old.meta.name || name;

          isAddressExisting = true;

          setName({ isNameValid: !!(newName || '').trim(), name: newName });
        }
      }

      if (latestAddressInput.current === input) {
        // Prevent possible race condition -- only the latest input can change state.
        setAddress({ address: address || '', addressInput: input, isAddressExisting, isAddressValid: !!address });
      }
    },
    [isEthereum, name, api, systemChain]
  );

  const _onChangeAddress = useCallback(
    (input: string) => {
      _onChangeAddressAsync(input).catch(console.error);
    },
    [_onChangeAddressAsync]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: !!name.trim(), name }),
    []
  );

  const _onCommit = useCallback(
    (): void => {
      const status = { action: 'create' } as ActionStatus;

      if (!isValid || !info?.accountId) {
        return;
      }

      try {
        const address = info.accountId.toString();

        keyring.saveAddress(address, { genesisHash: keyring.genesisHash, name: name.trim(), tags: [] });

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = isAddressExisting
          ? t<string>('address edited')
          : t<string>('address created');

        InputAddress.setLastValue('address', address);
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      onStatusChange(status);
      onClose();
    },
    [info, isAddressExisting, isValid, name, onClose, onStatusChange, t]
  );

  return (
    <Modal
      header={t<string>('Add an address')}
      onClose={onClose}
    >
      <Modal.Content>
        <AddressRow
          defaultName={name}
          isAzeroIdShown
          noDefaultNameOpacity
          value={
            isAddressValid
              ? info?.accountId?.toString()
              : undefined
          }
        >
          <Input
            autoFocus
            className='full'
            isError={!isAddressValid}
            label={t<string>('address or domain')}
            onChange={_onChangeAddress}
            onEnter={_onCommit}
            placeholder={t<string>('new address')}
            value={addressInput}
          />
          <Input
            className='full'
            isError={!isNameValid}
            label={t<string>('name')}
            onChange={_onChangeName}
            onEnter={_onCommit}
            value={name}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='save'
          isDisabled={!isValid}
          label={t<string>('Save')}
          onClick={_onCommit}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Create);
