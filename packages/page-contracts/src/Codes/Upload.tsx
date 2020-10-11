// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Hash } from '@polkadot/types/interfaces';

import React, { useCallback, useState } from 'react';
import { SubmittableResult } from '@polkadot/api';
import { InputAddress, InputFile, Modal, TxButton } from '@polkadot/react-components';
import { useAccountId, useNonEmptyString } from '@polkadot/react-hooks';
import { compactAddLength, isNull, isWasm } from '@polkadot/util';

import { ABI, InputName } from '../shared';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';

interface Props {
  onClose: () => void;
}

function Upload ({ onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const [accountId, setAccountId] = useAccountId();
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, isNameValid, setName] = useNonEmptyString();
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([compactAddLength(wasm), isWasm(wasm)]);
      setName(name.replace('.wasm', ''));
    },
    [setName]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const record = result.findRecord('contracts', 'CodeStored');

      if (record) {
        const codeHash = record.event.data[0];

        if (!codeHash || !name) {
          return;
        }

        store
          .saveCode(codeHash as Hash, { abi, name, tags: [] })
          .then()
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }
    },
    [abi, name]
  );

  const isSubmittable = !!accountId && (!isNull(name) && isNameValid) && isWasmValid && isAbiSupplied && isAbiValid;

  return (
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
          isError={isAbiError || !isAbiSupplied}
          isSupplied={isAbiSupplied}
          isValid={isAbiValid}
          onChange={onChangeAbi}
          onRemove={onRemoveAbi}
          withLabel
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='upload'
          isDisabled={!isSubmittable}
          label={t('Upload')}
          onClick={onClose}
          onSuccess={_onSuccess}
          params={[wasm]}
          tx='contracts.putCode'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Upload);
