// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useCallback, useState } from 'react';

import { InputAddress, InputFile, InputNumber, InputWasm, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN_ZERO, compactAddLength } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

interface CodeState {
  isWasmValid: boolean;
  wasm: Uint8Array | null;
}

function RegisterThread ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [paraId, setParaId] = useState<BN | undefined>();
  const [{ isWasmValid, wasm }, setWasm] = useState<CodeState>({ isWasmValid: false, wasm: null });
  const [genesisState, setGenesisState] = useState<Uint8Array | null>(null);

  const _setGenesisState = useCallback(
    (data: Uint8Array) => setGenesisState(compactAddLength(data)),
    []
  );

  const _setWasm = useCallback(
    (wasm: Uint8Array, isWasmValid: boolean) => setWasm({ isWasmValid, wasm }),
    []
  );

  return (
    <Modal
      className={className}
      header={t<string>('Register parathread')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account will be associated with the parachain and pay the deposit.')}>
          <InputAddress
            label={t<string>('register from')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The id of this parachain as known on the network')}>
          <InputNumber
            autoFocus
            isZeroable={false}
            label={t<string>('parachain id')}
            onChange={setParaId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The WASM validation function for this parachain.')}>
          <InputWasm
            help={t<string>('The compiled runtime WASM for the parachain you wish to register.')}
            isError={!isWasmValid}
            label={t<string>('code')}
            onChange={_setWasm}
            placeholder={wasm && !isWasmValid && t<string>('The code is not recognized as being in valid WASM format')}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The genesis state for this parachain.')}>
          <InputFile
            help={t<string>('The genesis state for the parachain.')}
            isError={!genesisState}
            label={t<string>('initial state')}
            onChange={_setGenesisState}
          />
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!isWasmValid || !genesisState || !paraId?.gt(BN_ZERO)}
          onStart={onClose}
          params={[paraId, genesisState, wasm]}
          tx={api.tx.registrar.register}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(RegisterThread);
