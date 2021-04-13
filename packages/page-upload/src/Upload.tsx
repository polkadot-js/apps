// Copyright 2017-2021 @canvas-ui/app-upload authors & contributors
// SPDX-License-Identifier: Apache-2.0

import store from '@canvas-ui/react-store/store';
import { registry } from '@canvas-ui/react-api';
import { Button, Input, InputABI, InputAddress, InputFile, TxButton } from '@canvas-ui/react-components';
import PendingTx from '@canvas-ui/react-signer/PendingTx';
import { useAbi, useAccountId, useApi, useFile, useNonEmptyString, useAppNavigation } from '@canvas-ui/react-hooks';
import { FileState } from '@canvas-ui/react-hooks/types';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

import { SubmittableResult } from '@polkadot/api';
import { compactAddLength, isNull, isWasm } from '@polkadot/util';

import { useTranslation } from './translate';

function Upload (): React.ReactElement {
  const { t } = useTranslation();
  const { navigateTo, pathTo } = useAppNavigation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const currentName = useRef(name);
  const [wasmFromFile, setWasmFromFile, isWasmFromFileSupplied, isWasmFromFileValid] = useFile({
    onChange: ({ name }: FileState): void => {
      if (currentName.current === '') {
        setName(name);
      }
    },
    validate: (file: FileState) => file?.data.subarray(0, 4).toString() === '0,97,115,109'
  });
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);

  useEffect((): void => {
    if (abi && isWasm(abi.project.source.wasm)) {
      setWasm(
        [abi.project.source.wasm, true]
      );

      if (currentName.current === '') {
        setName(`${abi.project.contract.name.toString()}.contract`);
      }

      return;
    }

    if (wasmFromFile && isWasmFromFileSupplied && isWasmFromFileValid) {
      setWasm(
        [compactAddLength(wasmFromFile.data), true]
      );

      return;
    }

    setWasm([null, false]);
  }, [abi, wasmFromFile, isWasmFromFileValid, isWasmFromFileSupplied, setName]);

  const pendingTx = usePendingTx('contracts.putCode');

  const isSubmittable = useMemo(
    (): boolean => !!accountId && (!isNull(name) && isNameValid) && isWasmValid && (!isAbiSupplied || isAbiValid),
    [accountId, name, isAbiSupplied, isAbiValid, isNameValid, isWasmValid]
  );

  const _onChangeName = useCallback(
    (name: string | null): void => {
      setName(name);
      currentName.current = name;
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

        store.saveCode({ abi: abi?.json || undefined, codeHash: codeHash.toHex(), name, tags: [] })
          .then((id): void => navigateTo.uploadSuccess(id)())
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }
    },
    [api, abi, name, navigateTo]
  );

  const additionalDetails = useMemo((): Record<string, string> => ({ name: name || '' }), [name]);
  // const preparedWasm = useMemo((): Uint8Array | null => wasm ? compactAddLength(wasm.data) : null, [wasm]);

  return (
    <PendingTx
      additionalDetails={additionalDetails}
      instructions={t<string>('Sign and submit to upload this code bundle on the chain.')}
      registry={registry}
      {...pendingTx}
    >
      <header>
        <h1>{t<string>('Upload Contract Bundle')}</h1>
        <div className='instructions'>
          {t<string>('You can upload an existing Wasm blob here. Already have a blob on chain? ')}
          <Link to={pathTo.instantiateAdd}>
            {t<string>('Add an existing code hash.')}
          </Link>
        </div>
      </header>
      <section>
        <InputAddress
          help={t<string>('Specify the user account to use for this code bundle upload. Any fees will be deducted from this account.')}
          isInput={false}
          label={t<string>('Account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <Input
          help={t<string>('A name for this WASM code to help users distinguish. Only used for display purposes.')}
          isError={isNameError}
          label={t<string>('Name')}
          onChange={_onChangeName}
          placeholder={t<string>('Give your bundle a descriptive name')}
          value={name}
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
        {abi?.project.source.wasm && abi.project.source.wasm.length === 0 && (
          <InputFile
            help={t<string>('The compiled WASM for the contract that you wish to upload. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
            isError={isWasmFromFileSupplied && !isWasmFromFileValid}
            label={t<string>('Upload Wasm Blob')}
            onChange={setWasmFromFile}
            placeholder={
              wasmFromFile && !isWasmFromFileValid
                ? t<string>('The code is not recognized as being in valid WASM format')
                : null
            }
            value={wasmFromFile}
          />
        )}
        <Button.Group>
          <TxButton
            accountId={accountId}
            isDisabled={!isSubmittable}
            isPrimary
            label={t<string>('Upload')}
            onSuccess={_onSuccess}
            params={[wasm]}
            tx={api.tx.contracts.putCode}
          />
        </Button.Group>
      </section>
    </PendingTx>
  );
}

export default React.memo(Upload);
