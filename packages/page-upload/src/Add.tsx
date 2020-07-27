// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as Props } from '@canvas-ui/apps/types';
import { PrefabWasmModule } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import store from '@canvas-ui/apps/store';
import useCodes from '@canvas-ui/apps/useCodes';
import { Button, Input, InputABI, InputName } from '@canvas-ui/react-components';
import { useAbi, useApi, useCall, useFile, useNonEmptyString, useNotification } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';
import { Option } from '@polkadot/types';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate';

function Add ({ className, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const showNotification = useNotification();
  const [codeHash, setCodeHash, , , isCodeHashTouched] = useNonEmptyString();
  const codeStorage = useCall<Option<PrefabWasmModule>>((api.query.contracts || api.query.contract).codeStorage, [codeHash]);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });
  const { hasCodes } = useCodes();
  const [isCodeHashValid, status] = useMemo(
    (): [boolean, React.ReactNode | null] => {
      const isCodeHashValidHex = !!codeHash && isHex(codeHash) && codeHash.length === 66;
      const isCodeHashOnChain = !!codeStorage && codeStorage.isSome;
      const isCodeAlreadyStored = !!codeHash && hasCodes && store.isHashSaved(codeHash);
      const isCodeHashValid = isCodeHashValidHex && isCodeHashOnChain && !isCodeAlreadyStored;

      let status = null;

      if (isCodeHashTouched) {
        if (!isCodeHashValidHex) {
          status = t<string>('The code hash is not a valid hex hash');
        } else if (!isCodeHashOnChain) {
          status = t<string>('Unable to find on-chain WASM code for the supplied code hash');
        } else if (isCodeAlreadyStored) {
          status = t<string>('You have already added this code hash to this device\'s storage');
        } else if (isCodeHashValid) {
          status = t<string>('Valid');
        }
      }

      return [
        isCodeHashValid,
        status
      ];
    },
    [codeHash, codeStorage, hasCodes, isCodeHashTouched, t]
  );

  const isValid = useMemo(
    (): boolean => isCodeHashValid && isNameValid,
    [isCodeHashValid, isNameValid]
  );

  const _onSave = useCallback(
    (): void => {
      if (!codeHash || !name) {
        return;
      }

      store
        .saveCode({ abi, codeHash, name, tags: [] })
        .then((id): void => {
          showNotification({
            action: truncate(codeHash, 12),
            message: t<string>('code bundle added'),
            status: 'success'
          });

          navigateTo.uploadSuccess(id)();
        })
        .catch((error): void => {
          console.error('Unable to save code', error);

          showNotification({
            action: truncate(codeHash, 12),
            message: (error as Error).message,
            status: 'error'
          });
        });
    },
    [abi, codeHash, name, navigateTo, showNotification, t]
  );

  return (
    <>
      <header>
        <h1>{t<string>('Add Existing Code Hash')}</h1>
        <div className='instructions'>
          {t<string>('Using the unique code hash you can add on-chain contract code for you to deploy.')}
        </div>
      </header>
      <section className={className}>
        <Input
          autoFocus
          help={t<string>('Code hash for the on-chain deployed code')}
          isError={isCodeHashTouched && !isCodeHashValid}
          label={t<string>('Code Hash')}
          onChange={setCodeHash}
          status={status}
          value={codeHash}
          withStatus
        />
        <InputName
          isError={isNameError}
          onChange={setName}
          placeholder={t<string>('Give your bundle a descriptive name')}
          value={name || undefined}
        />
        <InputABI
          contractAbi={contractAbi}
          errorText={errorText}
          file={abiFile}
          isError={isAbiError}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          setFile={setAbiFile}
          withLabel
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            label={t<string>('Save')}
            onClick={_onSave}
          />
          <Button
            label={t<string>('Cancel')}
            onClick={navigateTo.upload}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default styled(React.memo(Add))`
  .status-message {
    font-size: 0.9rem;
    height: 1rem;
    width: 100%;
    text-align: right;

    &.isError {
      color: var(--red-primary);
    }
    &.isValid {
      color: var(--green-primary);
    }
  }
`;
