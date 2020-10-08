// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '@canvas-ui/apps/types';
import { FileState } from '@canvas-ui/react-hooks/types';

import React, { useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import store from '@canvas-ui/apps/store';
import { Button, InputABI, InputAddress, InputFile, Input, TxButton } from '@canvas-ui/react-components';
import PendingTx from '@canvas-ui/react-components/PendingTx';
import { useAccountId, useAbi, useApi, useFile, useNonEmptyString } from '@canvas-ui/react-hooks';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import { compactAddLength, isNull, u8aToHex } from '@polkadot/util';

import { useTranslation } from './translate';

function Upload ({ basePath, navigateTo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [name, setName, isNameValid, isNameError] = useNonEmptyString();
  const [wasm, setWasm, isWasmSupplied, isWasmValid] = useFile({
    onChange: ({ name }: FileState): void => setName(name),
    validate: (file: FileState) => file?.data.subarray(0, 4).toString() === '0,97,115,109'
  });
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });

  const pendingTx = usePendingTx('contracts.putCode');

  const isSubmittable = useMemo(
    (): boolean => !!accountId && (!isNull(name) && isNameValid) && isWasmValid && (!isAbiSupplied || isAbiValid),
    [accountId, name, isAbiSupplied, isAbiValid, isNameValid, isWasmValid]
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
  const preparedWasm = useMemo((): Uint8Array | null => wasm ? compactAddLength(wasm.data) : null, [wasm]);

  if (pendingTx.currentItem) {
    return (
      <PendingTx
        additionalDetails={additionalDetails}
        instructions={t<string>('Sign and submit to upload this code bundle on the chain.')}
        {...pendingTx}
      />
    );
  }

  return (
    <>
      <header>
        <h1>{t<string>('Upload WASM Code Blob')}</h1>
        <div className='instructions'>
          {t<string>('You can upload an existing Wasm blob here. Already have a blob on chain? ')}
          <Link to={`${basePath}/add`}>
            {t<string>('Add an existing code hash.')}
          </Link>
        </div>
      </header>
      <section>
        <InputAddress
          help={t<string>('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
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
          onChange={setName}
          placeholder={t<string>('Give your bundle a descriptive name')}
          value={name}
        />
        <InputFile
          help={t<string>('The compiled WASM for the contract that you wish to deploy. Each unique code blob will be attached with a code hash that can be used to create new instances.')}
          isError={isWasmSupplied && !isWasmValid}
          label={t<string>('Upload Wasm Blob')}
          onChange={setWasm}
          placeholder={
            wasm && !isWasmValid
              ? t<string>('The code is not recognized as being in valid WASM format')
              : null
          }
          value={wasm}
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
          <TxButton
            accountId={accountId}
            isDisabled={!isSubmittable}
            label={t<string>('Upload')}
            onSuccess={_onSuccess}
            params={[preparedWasm]}
            tx={api.tx.contracts ? 'contracts.putCode' : 'contract.putCode'}
          />
        </Button.Group>
      </section>
    </>
  );
}

export default React.memo(Upload);
