// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import React, { useCallback, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, InputFile, InputNumber, InputWasm, MarkWarning, Modal, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BN, BN_TEN, BN_THOUSAND, BN_ZERO, compactAddLength } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
}

interface CodeState {
  isWasmValid: boolean;
  wasm: Uint8Array | null;
}

interface ValidatorProps {
  address: string;
  index: number;
  setAddress: (index: number, value: string) => void;
  t: TFunction;
}

function Validator ({ address, index, setAddress, t }: ValidatorProps): React.ReactElement<ValidatorProps> {
  const _setAddress = useCallback(
    (value: string | null) => value && setAddress(index, value),
    [index, setAddress]
  );

  return (
    <InputAddress
      defaultValue={address}
      label={t('validator {{index}}', { replace: { index: index + 1 } })}
      onChange={_setAddress}
    />
  );
}

function Propose ({ className, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [paraId, setParaId] = useState<BN | undefined>();
  const [balance, setBalance] = useState(() => BN_THOUSAND.mul(BN_TEN.pow(new BN(api.registry.chainDecimals[0]))));
  const [validators, setValidators] = useState<string[]>(['']);
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

  const _setAddress = useCallback(
    (index: number, address: string) =>
      setValidators((v) => v.map((v, i) => i === index ? address : v)),
    []
  );

  const _addValidator = useCallback(
    () => setValidators((v) => [...v, '']),
    []
  );

  const _delValidator = useCallback(
    () => setValidators((v) => [...v.slice(0, v.length - 1)]),
    []
  );

  const isNameValid = name.length >= 3;
  const isValDuplicate = validators.some((a, ai) => validators.some((b, bi) => ai !== bi && a === b));

  return (
    <Modal
      className={className}
      header={t<string>('Propose parachain')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('This account will be associated with the parachain and pay the deposit.')}>
          <InputAddress
            label={t<string>('propose from')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The name for this parachain, the id and the allocated/requested balance.')}>
          <Input
            autoFocus
            isError={!isNameValid}
            label={t<string>('parachain name')}
            onChange={setName}
          />
          <InputNumber
            isZeroable={false}
            label={t<string>('requested id')}
            onChange={setParaId}
          />
          <InputBalance
            defaultValue={balance}
            label={t<string>('initial balance')}
            onChange={setBalance}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The WASM validation function as well as the genesis state for this parachain.')}>
          <InputWasm
            help={t<string>('The compiled runtime WASM for the parachain you wish to register.')}
            isError={!isWasmValid}
            label={t<string>('validation code')}
            onChange={_setWasm}
            placeholder={wasm && !isWasmValid && t<string>('The code is not recognized as being in valid WASM format')}
          />
          <InputFile
            help={t<string>('The genesis state for the parachain.')}
            isError={!genesisState}
            label={t<string>('genesis state')}
            onChange={_setGenesisState}
          />
        </Modal.Columns>
        <Modal.Columns hint={t<string>('The validators for this parachain. At least one is required and where multiple is supplied, they need to be unique.')}>
          {validators.map((address, index) => (
            <Validator
              address={address}
              index={index}
              key={index}
              setAddress={_setAddress}
              t={t}
            />
          ))}
          {!validators.length && (
            <MarkWarning content={t<string>('You need to supply at last one running validator for your parachain alongside this request.')} />
          )}
          {isValDuplicate && (
            <MarkWarning content={t<string>('You have duplicated validator entries, ensure each is unique.')} />
          )}
          <Button.Group>
            <Button
              icon='plus'
              label={t<string>('Add validator')}
              onClick={_addValidator}
            />
            <Button
              icon='minus'
              isDisabled={validators.length === 0}
              label={t<string>('Remove validator')}
              onClick={_delValidator}
            />
          </Button.Group>
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={accountId}
          icon='plus'
          isDisabled={!isWasmValid || !genesisState || !isNameValid || !validators.length || !paraId?.gt(BN_ZERO)}
          onStart={onClose}
          params={[paraId, name, wasm, genesisState, validators, balance]}
          tx={api.tx.proposeParachain?.proposeParachain}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Propose);
