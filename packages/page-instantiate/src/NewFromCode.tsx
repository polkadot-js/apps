// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableResult } from '@polkadot/api';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { ComponentProps as Props } from './types';

import { Button, Dropdown, Input, InputABI, InputAddress, InputBalance, InputMegaGas, InputName, MessageArg, MessageSignature, Toggle, TxButton } from '@canvas-ui/react-components';
import { extractValues } from '@canvas-ui/react-components/Params/values';
import { ELEV_2_CSS } from '@canvas-ui/react-components/styles/constants';
import { RawParam } from '@canvas-ui/react-components/types';
import { useAbi, useAccountId, useApi, useAppNavigation, useFile, useGasWeight, useNonEmptyString, useNonZeroBn, useStepper } from '@canvas-ui/react-hooks';
import { ContractParams } from '@canvas-ui/react-params';
import PendingTx from '@canvas-ui/react-signer/PendingTx';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import store from '@canvas-ui/react-store/store';
import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { CodePromise } from '@polkadot/api-contract';
import keyring from '@polkadot/ui-keyring';
import { isWasm } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';

import { useTranslation } from './translate';

type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

const ENDOWMENT = new BN(1e15);

function defaultContractName (name?: string) {
  return name ? `${name} (instance)` : '';
}

function NewFromCode ({ className }: Props): React.ReactElement<Props> | null {
  // const { id, index = '0' }: { id: string, index?: string } = useParams();
  const { t } = useTranslation();
  const { api } = useApi();
  const { navigateTo } = useAppNavigation();
  const hasInstantiateWithCode = !!api.tx.contracts.instantiateWithCode;
  // const code = useMemo(
  //   (): Code | null => {
  //     return allCodes.find((code: Code) => id === code.id) || null;
  //   },
  //   [allCodes, id]
  // );
  const [step, nextStep, prevStep] = useStepper();
  const useWeightHook = useGasWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;
  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid] = useNonZeroBn(ENDOWMENT);
  const [constructorIndex, setConstructorIndex] = useState(0);
  const [[wasm, isWasmValid], setWasm] = useState<[Uint8Array | null, boolean]>([null, false]);
  const { abi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi();
  const [abiFile, setAbiFile] = useFile({ onChange: onChangeAbi, onRemove: onRemoveAbi });
  const [salt, setSalt] = useState(randomAsHex());
  const [withSalt, setWithSalt] = useState(false);
  const [[uploadTx], setUploadTx] = useState<[SubmittableExtrinsic<'promise'> | null, string | null]>([null, null]);
  const [codeName, setCodeName, isCodeNameValid, isCodeNameError] = useNonEmptyString(t(abi?.project.contract.name.toString() || ''));
  const [contractName, setContractName, isContractNameValid, isContractNameError] = useNonEmptyString(t(defaultContractName(abi?.project.contract.name.toString())));
  const currentCodeName = useRef(codeName);
  const currentContractName = useRef(contractName);

  useEffect(() => {
    if (!hasInstantiateWithCode) {
      navigateTo.instantiate();
    }
  }, [hasInstantiateWithCode, navigateTo]
  );

  useEffect((): void => {
    if (abi && isWasm(abi.project.source.wasm)) {
      setWasm(
        [abi.project.source.wasm, true]
      );

      const projectName = abi.project.contract.name.toString();

      if (currentCodeName.current === '') {
        setCodeName(`${projectName}.contract`);
      }

      if (currentContractName.current === '') {
        setContractName(defaultContractName(projectName));
      }

      return;
    }

    setWasm([null, false]);
  }, [abi, setContractName, setCodeName]);

  const code = useMemo(
    () => isAbiValid && isWasmValid && wasm && abi
      ? new CodePromise(api, abi, wasm)
      : null,
    [api, abi, isAbiValid, isWasmValid, wasm]
  );

  const constructOptions = useMemo(
    (): ConstructOptions => {
      if (!abi) {
        return [];
      }

      return abi.constructors.map(
        (constructor, index) => {
          return {
            key: `${index}`,
            text: (
              <MessageSignature
                isConstructor
                message={constructor}
                registry={abi.registry}
              />
            ),
            value: `${index}`
          };
        });
    },
    [abi]
  );

  const isValid = useMemo(
    (): boolean => isCodeNameValid && isContractNameValid && isEndowmentValid && isWeightValid && !!accountId,
    [accountId, isEndowmentValid, isCodeNameValid, isContractNameValid, isWeightValid]
  );

  const [params, setParams] = useState<RawParam[]>([]);

  useEffect((): void => {
    if (!abi) return;

    let contract: SubmittableExtrinsic<'promise'> | null = null;
    let error: string | null = null;

    try {
      const { identifier } = abi?.constructors[constructorIndex];

      contract = code && identifier && endowment
        ? code.tx[identifier]({ gasLimit: weight, salt: withSalt ? salt : null, value: endowment }, ...extractValues(params))
        : null;
    } catch (e) {
      error = (e as Error).message;

      console.error(error);
    }

    setUploadTx(() => [contract, error]);
  }, [code, abi, constructorIndex, endowment, params, salt, weight, withSalt]);

  const _onChangeCodeName = useCallback(
    (name: string | null): void => {
      setCodeName(name);
      currentCodeName.current = name;
    },
    [setCodeName]
  );

  const _onChangeContractName = useCallback(
    (name: string | null): void => {
      setContractName(name);
      currentContractName.current = name;
    },
    [setContractName]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';

      const codeStoredRecord = result.findRecord(section, 'CodeStored');

      if (codeStoredRecord) {
        const codeHash = codeStoredRecord.event.data[0];

        if (!codeHash || !codeName) {
          return;
        }

        store.saveCode({ abi: abi?.json || undefined, codeHash: codeHash.toHex(), name: codeName, tags: [] })
          .then(() => { console.log('Saved code'); })
          .catch((error: any): void => {
            console.error('Unable to save code', error);
          });
      }

      const instantiatedRecords = result.filterRecords(section, 'Instantiated');

      if (instantiatedRecords.length) {
        // find the last EventRecord (in the case of multiple contracts deployed - we should really be
        // more clever here to find the exact contract deployed, this works for eg. Delegator)
        const address = instantiatedRecords[instantiatedRecords.length - 1].event.data[1] as unknown as AccountId;

        keyring.saveContract(address.toString(), {
          contract: {
            abi: abi?.json || undefined,
            genesisHash: api.genesisHash.toHex()
          },
          name: contractName,
          tags: []
        });

        navigateTo.instantiateSuccess(address.toString())();
      }
    },
    [abi, api, codeName, contractName, navigateTo]
  );

  const additionalDetails = useMemo(
    (): Record<string, any> => {
      if (abi) {
        return {
          codeName: codeName || '',
          constructor: constructOptions[constructorIndex]?.text,
          // data: encoder ? u8aToHex(encoder()) : null,
          contractName: contractName || '',
          params: abi.constructors[constructorIndex].args.map((param, index) => ({
            arg: (
              <MessageArg
                arg={param}
                registry={abi?.registry}
              />
            ),
            type: param.type,
            value: params[index] ? params[index].value : null
          })),
          weight: weight.toString()
        };
      }

      return {};
    },
    [abi, codeName, contractName, constructOptions, constructorIndex, params, weight]
  );

  const pendingTx = usePendingTx('contracts.instantiateWithCode');

  return (
    <PendingTx
      additionalDetails={additionalDetails}
      instructions={t<string>('Sign and submit to instantiate this contract derived from the code hash.')}
      registry={abi?.registry}
      {...pendingTx}
    >
      <div className={className}>
        <header>
          <h1>{t<string>('Instantiate {{contractName}}', { replace: { contractName: contractName || 'Contract' } })}</h1>
          <div className='instructions'>
            {t<string>('Choose an account to instantiate the contract from, give it a descriptive name and set the endowment amount.')}
          </div>
        </header>
        <section>
          <InputAddress
            help={t<string>('Specify the user account to use for this instantiation. Any fees will be deducted from this account.')}
            isInput={false}
            label={t<string>('instantiation account')}
            onChange={setAccountId}
            type='account'
            value={accountId}
          />
          {step === 1 && (
            <>
              <h3>Code Bundle Upload</h3>
              <Input
                help={t<string>('A name for this WASM code bundle to help users distinguish. Only used for display purposes.')}
                isError={isCodeNameError}
                label={t<string>('Name')}
                onChange={_onChangeCodeName}
                placeholder={t<string>('Give your code bundle a descriptive name')}
                value={codeName}
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
            </>
          )}
          {step === 2 && abi && (
            <>
              <h3>Contract Instantiation</h3>
              <InputName
                isContract
                isError={isContractNameError}
                onChange={_onChangeContractName}
                value={contractName || ''}
              />
              <Dropdown
                help={t<string>('The instantiation constructor information for this contract, as provided by the ABI.')}
                isDisabled={abi.constructors.length <= 1}
                label={t<string>('Instantiation Constructor')}
                onChange={setConstructorIndex}
                options={constructOptions}
                value={`${constructorIndex}`}
              />
              <ContractParams
                onChange={setParams}
                params={abi.constructors[constructorIndex].args}
                values={params}
              />
              <InputBalance
                help={t<string>('The allotted endowment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
                isError={!isEndowmentValid}
                label={t<string>('Endowment')}
                onChange={setEndowment}
                value={endowment}
              />
              <Input
                help={t<string>('A hex or string value that acts as a salt for this instantiation.')}
                isDisabled={!withSalt}
                label={t<string>('Unique Instantiation Salt')}
                onChange={setSalt}
                placeholder={t<string>('0x prefixed hex, e.g. 0x1234 or ascii data')}
                value={withSalt ? salt : t<string>('<none>')}
              >
                <Toggle
                  className='toggle'
                  isOverlay
                  label={t<string>('use salt')}
                  onChange={setWithSalt}
                  value={withSalt}
                />
              </Input>
              <InputMegaGas
                help={t<string>('The maximum amount of gas that can be used by this transaction, if the code requires more, the transaction will fail.')}
                weight={useWeightHook}
              />
            </>
          )}
          <Button.Group>
            {step === 1 && (
              <Button
                icon='caret-right'
                isDisabled={!abi}
                label={t<string>('Constructor Details')}
                onClick={nextStep}
              />
            )}
            {step === 2 && (
              <>
                <Button
                  icon='caret-left'
                  isDisabled={!abi}
                  label={t<string>('Edit Code Bundle')}
                  onClick={prevStep}
                />
                <TxButton
                  accountId={accountId}
                  extrinsic={uploadTx}
                  icon='cloud-upload-alt'
                  isDisabled={!isValid}
                  isPrimary
                  label={t<string>('Instantiate')}
                  onSuccess={_onSuccess}
                  withSpinner
                />
              </>
            )}
          </Button.Group>
        </section>
      </div>
    </PendingTx>
  );
}

export default React.memo(styled(NewFromCode)`
  .toggle {
    margin-left: 0.5rem;
  }

  .code-bundle {
    ${ELEV_2_CSS}
    display: block;
    padding: 0.625rem;
    width: 100%;

    .name {
      color: var(--grey60);
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .code-hash {
      font-family: monospace;
      font-size: 1rem;
      color: var(--grey80);
    }
  }
`);
