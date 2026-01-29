// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { CodeSubmittableResult } from '@polkadot/api-contract/promise/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CodePromise } from '@polkadot/api-contract';
import { Button, Dropdown, InputAddress, InputBalance, InputFile, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useFormField, useNonEmptyString, useStepper } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, isNull, isWasm, stringify } from '@polkadot/util';

import { ABI, InputMegaGas, InputName, MessageSignature, Params } from '../shared/index.js';
import store from '../store.js';
import { useTranslation } from '../translate.js';
import useAbi from '../useAbi.js';
import useWeight from '../useWeight.js';

interface Props {
  onClose: () => void;
}

function Upload ({ onClose }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [accountId, setAccountId] = useAccountId();
  const [step, nextStep, prevStep] = useStepper();
  const [[uploadTx, error], setUploadTx] = useState<[SubmittableExtrinsic<'promise'> | null, string | null]>([null, null]);
  const [constructorIndex, setConstructorIndex] = useState<number>(0);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [params, setParams] = useState<unknown[]>([]);
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
      ? contractAbi.constructors.map((c, index) => ({
        info: c.identifier,
        key: c.identifier,
        text: (
          <MessageSignature
            asConstructor
            message={c}
          />
        ),
        value: index
      }))
      : [],
    [contractAbi]
  );

  useEffect((): void => {
    setConstructorIndex(0);
  }, [constructOptions]);

  useEffect((): void => {
    setParams([]);
  }, [contractAbi, constructorIndex]);

  useEffect((): void => {
    setWasm(
      contractAbi && isWasm(contractAbi.info.source.wasm)
        ? [contractAbi.info.source.wasm, true]
        : [null, false]
    );
  }, [contractAbi]);

  useEffect((): void => {
    abiName && setName(abiName);
  }, [abiName, setName]);

  useEffect((): void => {
    async function dryRun () {
      let contract: SubmittableExtrinsic<'promise'> | null = null;
      let error: string | null = null;

      try {
        if (code && contractAbi?.constructors[constructorIndex]?.method && value && accountId) {
          const dryRunParams: Parameters<typeof api.call.contractsApi.instantiate> =
            [
              accountId,
              contractAbi?.constructors[constructorIndex].isPayable
                ? api.registry.createType('Balance', value)
                : api.registry.createType('Balance', BN_ZERO),
              weight.weightV2,
              null,
              { Upload: api.registry.createType('Raw', wasm) },
              contractAbi?.constructors[constructorIndex]?.toU8a(params),
              ''
            ];

          const dryRunResult = await api.call.contractsApi.instantiate(...dryRunParams);

          contract = code.tx[contractAbi.constructors[constructorIndex].method]({
            gasLimit: dryRunResult.gasRequired,
            storageDepositLimit: dryRunResult.storageDeposit.isCharge ? dryRunResult.storageDeposit.asCharge : null,
            value: contractAbi?.constructors[constructorIndex].isPayable ? value : undefined
          }, ...params);
        }
      } catch (e) {
        error = (e as Error).message;
      }

      setUploadTx(() => [contract, error]);
    }

    dryRun().catch((e) => console.error(e));
  }, [accountId, wasm, api, code, contractAbi, constructorIndex, value, params, weight]);

  const _onAddWasm = useCallback(
    (wasm: Uint8Array, name: string): void => {
      setWasm([wasm, isWasm(wasm)]);
      setName(name.replace('.wasm', '').replace('_', ' '));
    },
    [setName]
  );

  const _onSuccess = useCallback(
    (result: CodeSubmittableResult): void => {
      result.blueprint && store.saveCode(result.blueprint.codeHash, {
        abi: stringify(result.blueprint.abi.json),
        name: name || '<>',
        tags: []
      });
      result.contract && keyring.saveContract(result.contract.address.toString(), {
        contract: {
          abi: stringify(result.contract.abi.json),
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
    <Modal
      header={t('Upload & deploy code {{info}}', { replace: { info: `${step}/2` } })}
      onClose={onClose}
    >
      <Modal.Content>
        {step === 1 && (
          <>
            <InputAddress
              isInput={false}
              label={t('deployment account')}
              labelExtra={
                <Available
                  label={t('transferable')}
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
              label={t('json for either ABI or .contract bundle')}
              onChange={onChangeAbi}
              onRemove={onRemoveAbi}
              withWasm
            />
            {!invalidAbi && contractAbi && (
              <>
                {!contractAbi.info.source.wasm.length && (
                  <InputFile
                    isError={!isWasmValid}
                    label={t('compiled contract WASM')}
                    onChange={_onAddWasm}
                    placeholder={wasm && !isWasmValid && t('The code is not recognized as being in valid WASM format')}
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
            {contractAbi.constructors[constructorIndex].isPayable && (
              <InputBalance
                isError={!isValueValid}
                isZeroable
                label={t('value')}
                onChange={setValue}
                value={value}
              />
            )
            }
            <InputMegaGas
              weight={weight}
            />
            {error && (
              <MarkError content={error} />
            )}
          </>
        )}
      </Modal.Content>
      <Modal.Actions>
        {step === 1
          ? (
            <Button
              icon='step-forward'
              isDisabled={!code || !contractAbi}
              label={t('Next')}
              onClick={nextStep}
            />
          )
          : (
            <Button
              icon='step-backward'
              label={t('Prev')}
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
