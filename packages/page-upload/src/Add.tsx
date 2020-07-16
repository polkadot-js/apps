// Copyright 2017-2020 @polkadot/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PrefabWasmModule } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from './types';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';
import store from '@polkadot/apps/store';
import { InputABI, Button, Input, InputName } from '@polkadot/react-components';
import { useAbi, useApi, useCall, useNonEmptyString } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { isHex } from '@polkadot/util';

import { useTranslation } from './translate';

function Add ({ basePath, className, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [codeHash, setCodeHash, , , isCodeHashTouched] = useNonEmptyString();
  const codeStorage = useCall<Option<PrefabWasmModule>>((api.query.contracts || api.query.contract).codeStorage, [codeHash]);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [isCodeHashValidHex, isCodeHashValid] = useMemo(
    (): [boolean, boolean] => {
      const isCodeHashValidHex = !!codeHash && isHex(codeHash) && codeHash.length === 66;
      const isStored = !!codeStorage && codeStorage.isSome;
      const isCodeHashValid = isCodeHashValidHex && isStored;

      return [
        isCodeHashValidHex,
        isCodeHashValid
      ];
    },
    [codeHash, codeStorage]
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
        .saveCode({abi, codeHash, name, tags: [] })
        .then(navigateTo.uploadSuccess)
        .catch((error): void => {
          console.error('Unable to save code', error);
        });
    },
    [abi, codeHash, name]
  );

  return (
    <div className={className}>
      <header>
        <h1>{t<string>('Add Existing Code Hash')}</h1>
        <div className='instructions'>
          {t<string>('Using the unique code hash you can add on-chain contract code for you to deploy.')}
        </div>
      </header>
      <section>
        <Input
          autoFocus
          help={t('Code hash for the on-chain deployed code')}
          isError={isCodeHashTouched && !isCodeHashValid}
          label={t('Code Hash')}
          onChange={setCodeHash}
          value={codeHash}
        >
          <div className='error-message'>
            {
              isCodeHashTouched && !isCodeHashValid
                ? (
                  isCodeHashValidHex
                    ? t('Unable to find on-chain WASM code for the supplied codeHash')
                    : t('The code hash is not a valid hex hash')
                )
                : ''
            }
          </div>
        </Input>
        <InputName
          isError={isNameError}
          onChange={setName}
          placeholder={t('Give your bundle a descriptive name')}
          value={name || undefined}
        />
        <InputABI
          contractAbi={contractAbi}
          errorText={errorText}
          isError={isAbiError}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          onChange={onChangeAbi}
          onRemove={onRemoveAbi}
          withLabel
        />
        <Button.Group>
          <Button
            isDisabled={!isValid}
            isPrimary
            label={t('Save')}
            onClick={_onSave}
          />
          <Button
            label={t('Cancel')}
            onClick={navigateTo.upload}
          />
        </Button.Group>
      </section>
    </div>
  );
}

export default styled(React.memo(Add))`
  .error-message {
    color: var(--red-primary);
    font-size: 0.9rem;
    height: 1rem;
    width: 100%;
    text-align: right;
  }
`;
