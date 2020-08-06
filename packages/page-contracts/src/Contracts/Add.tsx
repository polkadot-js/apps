// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useMemo, useState } from 'react';
import { AddressRow, Button, Input, Modal } from '@polkadot/react-components';
import { useApi, useNonEmptyString, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import ValidateAddr from './ValidateAddr';
import { ABI, InputName } from '../shared';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

function Add (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleIsOpen, setIsOpen] = useToggle();
  const [address, setAddress] = useState<StringOrNull>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [name, isNameValid, setName] = useNonEmptyString('New Contract');
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([null, null], null, true);

  const isValid = useMemo(
    (): boolean => isAddressValid && isNameValid && isAbiValid,
    [isAbiValid, isAddressValid, isNameValid]
  );

  const _onAdd = useCallback(
    (): void => {
      const status: Partial<ActionStatus> = { action: 'create' };

      if (!address || !abi || !name) {
        return;
      }

      try {
        const json = {
          contract: {
            abi,
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        };

        keyring.saveContract(address, json);

        status.account = address;
        status.status = address ? 'success' : 'error';
        status.message = 'contract added';

        setIsOpen(false);
      } catch (error) {
        console.error(error);

        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [abi, address, api, name, setIsOpen]
  );

  return (
    <>
      <Button
        icon='plus'
        label={t('Add an existing contract')}
        onClick={toggleIsOpen}
      />
      <Modal
        header={t('Add an existing contract')}
        onClose={toggleIsOpen}
        open={isOpen}
      >
        <Modal.Content>
          <AddressRow
            defaultName={name}
            isValid
            value={address || null}
          >
            <Input
              autoFocus
              help={t<string>('The address for the deployed contract instance.')}
              isError={!isAddressValid}
              label={t<string>('contract address')}
              onChange={setAddress}
              value={address || ''}
            />
            <ValidateAddr
              address={address}
              onChange={setIsAddressValid}
            />
            <InputName
              isContract
              isError={!isNameValid}
              onChange={setName}
              value={name || undefined}
            />
            <ABI
              contractAbi={contractAbi}
              errorText={errorText}
              isContract
              isError={isAbiError}
              isSupplied={isAbiSupplied}
              isValid={isAbiValid}
              onChange={onChangeAbi}
              onRemove={onRemoveAbi}
              withLabel
            />
          </AddressRow>
        </Modal.Content>
        <Modal.Actions onCancel={toggleIsOpen}>
          <Button
            icon='save'
            isDisabled={!isValid}
            label={t<string>('Save')}
            onClick={_onAdd}
          />
        </Modal.Actions>
      </Modal>
    </>
  );
}

export default React.memo(Add);
