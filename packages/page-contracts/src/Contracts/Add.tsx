// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useState } from 'react';

import { AddressRow, Button, Input, Modal } from '@polkadot/react-components';
import { useApi, useNonEmptyString } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';

import { ABI, InputName } from '../shared/index.js';
import { useTranslation } from '../translate.js';
import useAbi from '../useAbi.js';
import ValidateAddr from './ValidateAddr.js';

interface Props {
  onClose: () => void;
}

function Add ({ onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [address, setAddress] = useState<string | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [name, isNameValid, setName] = useNonEmptyString('New Contract');
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([null, null], null, true);

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

        onClose();
      } catch (error) {
        console.error(error);

        status.status = 'error';
        status.message = (error as Error).message;
      }
    },
    [abi, address, api, name, onClose]
  );

  const isValid = isAddressValid && isNameValid && isAbiValid;

  return (
    <Modal
      header={t('Add an existing contract')}
      onClose={onClose}
    >
      <Modal.Content>
        <AddressRow
          defaultName={name}
          isValid
          value={address || null}
        >
          <Input
            autoFocus
            isError={!isAddressValid}
            label={t('contract address')}
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
            isError={isAbiError || !isAbiValid}
            isSupplied={isAbiSupplied}
            isValid={isAbiValid}
            onChange={onChangeAbi}
            onRemove={onRemoveAbi}
          />
        </AddressRow>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='save'
          isDisabled={!isValid}
          label={t('Save')}
          onClick={_onAdd}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Add);
