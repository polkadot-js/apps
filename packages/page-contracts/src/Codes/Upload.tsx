// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { CodeSubmittableResult } from '@polkadot/api-contract/promise/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CodePromise } from '@polkadot/api-contract';
import { Button, Dropdown, InputAddress, InputBalance, InputFile, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useNonEmptyString, useNonZeroBn, useStepper } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { isNull, isWasm } from '@polkadot/util';

import { ENDOWMENT } from '../constants';
import { ABI, InputMegaGas, InputName, MessageSignature, Params } from '../shared';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';
import useWeight from '../useWeight';

interface Props {
  onClose: () => void;
}

function Upload ({ onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [step, nextStep, prevStep] = useStepper();
  const [[uploadTx, error], setUploadTx] = useState<[SubmittableExtrinsic<'promise'> | null, string | null]>([null, null]);
  const [constructorIndex, setConstructorIndex] = useState(0);
  const [endowment, isEndowmentValid, setEndowment] = useNonZeroBn(ENDOWMENT);
  const [params, setParams] = useState<any[]>([]);
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const [name, isNameValid, setName] = useNonEmptyString();
  const { abiName, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const weight = useWeight();

  const code = useMemo(
    () => isAbiValid && isWasmValid && wasm && contractAbi
      ? new CodePromise(api, contractAbi, wasm)
      : null,
    [api, contractAbi, isAbiValid, isWasmValid, wasm]
  );

  const constructOptions = useMemo(
    () => contractAbi
      ? contractAbi.constructors.map((message, index) => ({
        info: message.identifier,
        key: `${index}`,
        text: (
          <MessageSignature
            asConstructor
            message={message}
          />
        ),
        value: index
      }))
      : [],
    [contractAbi]
  );

  useEffect((): void => {
    setConstructorIndex(() =>
      constructOptions.find(({ info }) => info === 'default')?.value || 0
    );
  }, [constructOptions]);

  useEffect((): void => {
    setParams([]);
  }, [constructorIndex]);

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

  useEffect((): void => {
    let contract: SubmittableExtrinsic<'promise'> | null = null;
    let error: string | null = null;

    try {
      contract = code && contractAbi && endowment
        ? code.createContract(constructorIndex, { gasLimit: weight.weight, value: endowment }, params)
        : null;
    } catch (e) {
      error = (e as Error).message;
    }

    setUploadTx(() => [contract, error]);
  }, [code, contractAbi, constructorIndex, endowment, params, weight]);

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
          name: name || '<>',
          tags: []
        })
        .catch(console.error);
      result.contract && keyring.saveContract(result.contract.address.toString(), {
        contract: {
          abi: JSON.stringify(result.contract.abi.json),
          genesisHash: api.genesisHash.toHex()
        },
        name: name || '<>',
        tags: []
      });
    },
    [api, name]
  );

  const isSubmittable = !!accountId && (!isNull(name) && isNameValid) && isWasmValid && isAbiSupplied && isAbiValid && !!uploadTx && step === 2;
  const invalidAbi = isAbiError || !isAbiSupplied;

  return (
    <Modal header={t('Upload & deploy code {{info}}', { replace: { info: `${step}/2` } })}>
      <Modal.Content>
        {step === 1 && (
          <>
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
                    placeholder={wasm && !isWasmValid && t<string>('The code is not recognized as being in valid WASM format')}
                  />
                )}
                <InputName
                  isError={!isNameValid}
                  onChange={setName}
                  value={name || undefined}
                />
              </>
            )}
          </>
        )}
        {step === 2 && contractAbi && (
          <>
            <Dropdown
              help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
              isDisabled={contractAbi.constructors.length <= 1}
              label={t('deployment constructor')}
              onChange={setConstructorIndex}
              options={constructOptions}
              value={constructorIndex}
            />
            <Params
              onChange={setParams}
              params={contractAbi.constructors[constructorIndex].args}
              registry={contractAbi.registry}
            />
            <InputBalance
              help={t<string>('The allotted endowment for the deployed contract, i.e. the amount transferred to the contract upon instantiation.')}
              isError={!isEndowmentValid}
              label={t<string>('endowment')}
              onChange={setEndowment}
              value={endowment}
            />
            <InputMegaGas
              help={t<string>('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
              weight={weight}
            />
            {error && (
              <MarkError content={error} />
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        {step === 1
          ? (
            <Button
              icon='step-forward'
              isDisabled={!code || !contractAbi}
              label={t<string>('Next')}
              onClick={nextStep}
            />
          )
          : (
            <Button
              icon='step-backward'
              label={t<string>('Prev')}
              onClick={prevStep}
            />
          )
        }
        <TxButton
          accountId={accountId}
          extrinsic={uploadTx}
          icon='upload'
          isDisabled={!isSubmittable}
          label={t('Deploy')}
          onClick={onClose}
          onSuccess={_onSuccess}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Upload);
