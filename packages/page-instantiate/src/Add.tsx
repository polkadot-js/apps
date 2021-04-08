// Copyright 2017-2021 @canvas-ui/app-upload authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from '@canvas-ui/react-store/store';
import { ComponentProps as Props } from '@canvas-ui/react-components/types';
import useCodes from '@canvas-ui/react-store/useCodes';
import { Button, Input, InputABI, InputName } from '@canvas-ui/react-components';
import { useAbi, useApi, useAppNavigation, useCall, useFile, useHasInstantiateWithCode, useNonEmptyString, useNotification } from '@canvas-ui/react-hooks';
import { truncate } from '@canvas-ui/react-util';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import { Option } from '@polkadot/types';
import { PrefabWasmModule } from '@polkadot/types/interfaces';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate';

function Add ({ className }: Props): React.ReactElement<Props> {
  const history = useHistory();
  const { t } = useTranslation();
  const { api } = useApi();
  const { navigateTo } = useAppNavigation();
  const hasInstantiateWithCode = useHasInstantiateWithCode();
  const showNotification = useNotification();
  const [codeHash, setCodeHash, , , isCodeHashTouched] = useNonEmptyString();
  const codeStorage = useCall<Option<PrefabWasmModule>>((api.query.contracts || api.query.contract).codeStorage, [codeHash]);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
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
      if (!codeHash || !name || !abi) {
        return;
      }

      store
        .saveCode({ abi: abi.json, codeHash, name, tags: [] })
        .then((id): void => {
          showNotification({
            action: truncate(codeHash, 12),
            message: t<string>('code bundle added'),
            status: 'success'
          });

          if (hasInstantiateWithCode) {
            navigateTo.instantiate();
          } else {
            navigateTo.uploadSuccess(id);
          }
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
    [abi, codeHash, hasInstantiateWithCode, name, navigateTo, showNotification, t]
  );

  return (
    <>
      <header>
        <h1>{t<string>('Add Existing Code Hash')}</h1>
        <div className='instructions'>
          {t<string>('Using the unique code hash, you can add an on-chain contract code for you to instantiate.')}
        </div>
      </header>
      <section className={className}>
        <Input
          autoFocus
          help={t<string>('Code hash for the on-chain uploaded code')}
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
          abi={abi}
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
            onClick={history.goBack}
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
