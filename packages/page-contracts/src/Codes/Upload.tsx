// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { Button, InputAddress, InputFile, Modal, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useNonEmptyString, useToggle } from '@polkadot/react-hooks';
import { compactAddLength, isNull } from '@polkadot/util';

import { ABI, InputName } from '../shared';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

function Upload (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleIsOpen] = useToggle();
  const [accountId, setAccountId] = useAccountId();
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, isNameValid, setName] = useNonEmptyString();
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const isSubmittable = useMemo(
    (): boolean => !!accountId && (!isNull(name) && isNameValid) && isWasmValid && (!isAbiSupplied || isAbiValid),
    [accountId, name, isAbiSupplied, isAbiValid, isNameValid, isWasmValid]
  );

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([compactAddLength(wasm), wasm.subarray(0, 4).toString() === '0,97,115,109']);
      setName(name);
    },
    [setName]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';
      const record = result.findRecord(section, 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store.saveCode(codeHash as Hash, { abi, name, tags: [] })
          .then()
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }
    },
    [api, abi, name]
  );

  return (
    <>
      <Button
        icon='plus'
        label={t('Upload WASM')}
        onClick={toggleIsOpen}
      />
      {isOpen && (
        <Modal header={t('Upload WASM')}>
          <Modal.Content>
            <InputAddress
              help={t('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
              isInput={false}
              label={t('deployment account')}
              onChange={setAccountId}
              type='account'
              value={accountId}
            />
            <InputFile
              help={t<string>('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
              isError={!isWasmValid}
              label={t<string>('compiled contract WASM')}
              onChange={_onAddWasm}
              placeholder={
                wasm && !isWasmValid
                  ? t<string>('The code is not recognized as being in valid WASM format')
                  : null
              }
            />
            <InputName
              isError={!isNameValid}
              onChange={setName}
              value={name || undefined}
            />
            <ABI
              contractAbi={contractAbi}
              errorText={errorText}
              isError={isAbiError}
              isSupplied={isAbiSupplied}
              isValid={isAbiValid}
              onChange={onChangeAbi}
              onRemove={onRemoveAbi}
              withLabel
            />
          </Modal.Content>
          <Modal.Actions onCancel={toggleIsOpen}>
            <TxButton
              accountId={accountId}
              icon='upload'
              isDisabled={!isSubmittable}
              label={t('Upload')}
              onClick={toggleIsOpen}
              onSuccess={_onSuccess}
              params={[wasm]}
              tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Upload);
