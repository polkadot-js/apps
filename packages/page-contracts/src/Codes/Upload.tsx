// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { CodeSubmittableResult } from '@polkadot/api-contract/promise/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CodePromise } from '@polkadot/api-contract';
import { InputAddress, InputFile, Modal, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useNonEmptyString } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { isNull, isWasm } from '@polkadot/util';

import { ABI, InputName } from '../shared';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

interface Props {
  onClose: () => void;
}

function Upload ({ onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [uploadTx, setUploadTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, isNameValid, setName] = useNonEmptyString();
  const { abiName, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const code = useMemo(
    () => isAbiValid && isWasmValid && wasm && contractAbi
      ? new CodePromise(api, contractAbi, wasm)
      : null,
    [api, contractAbi, isAbiValid, isWasmValid, wasm]
  );

  useEffect((): void => {
    setUploadTx(() => code ? code.createBlueprint() : null);
  }, [code]);

  useEffect((): void => {
    setWasm(
      contractAbi && isWasm(contractAbi.project.source.wasm)
        ? [contractAbi.project.source.wasm, true]
        : [null, false]
    );
  }, [contractAbi]);

  useEffect((): void => {
    abiName && setName(abiName);
  }, [abiName, setName]);

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([wasm, isWasm(wasm)]);
      setName(name.replace('.wasm', '').replace('_', ' '));
    },
    [setName]
  );

  const _onSuccess = useCallback(
    (result: CodeSubmittableResult): void => {
      result.blueprint && store
        .saveCode(result.blueprint.codeHash, {
          abi: JSON.stringify(result.blueprint.abi.json),
          name: name || '<unknown>',
          tags: []
        })
        .catch(console.error);
    },
    [name]
  );

  const isSubmittable = !!accountId && (!isNull(name) && isNameValid) && isWasmValid && isAbiSupplied && isAbiValid && !!uploadTx;
  const invalidAbi = isAbiError || !isAbiSupplied;

  return (
    <Modal header={t('Upload WASM')}>
      <Modal.Content>
        <InputAddress
          help={t('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
          isInput={false}
          label={t('deployment account')}
          labelExtra={
            <Available
              label={t<string>('transferrable')}
              params={accountId}
            />
          }
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <ABI
          contractAbi={contractAbi}
          errorText={errorText}
          isError={invalidAbi}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          label={t<string>('json for either ABI or .contract bundle')}
          onChange={onChangeAbi}
          onRemove={onRemoveAbi}
          withWasm
        />
        {!invalidAbi && contractAbi && (
          <>
            {!contractAbi.project.source.wasm.length && (
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
            )}
            <InputName
              isError={!isNameValid}
              onChange={setName}
              value={name || undefined}
            />
          </>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={uploadTx}
          icon='upload'
          isDisabled={!isSubmittable}
          label={t('Upload')}
          onClick={onClose}
          onSuccess={_onSuccess}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Upload);
