// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/apps/types';
import { RawParams } from '@canvas-ui/react-params/types';
import { InkMessage, InkMessageParam, InkConstructor } from '@canvas-ui/api-contract/types';
import { AccountId } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { SubmittableResult } from '@polkadot/api';
import { Button, ContractParams, Dropdown, InputAddress, InputBalance, InputMegaGas, InputName, Labelled, MessageArg, MessageSignature, PendingTx, TxButton } from '@canvas-ui/react-components';
import { ELEV_2_CSS } from '@canvas-ui/react-components/styles/constants';
import { useAbi, useAccountId, useGasWeight, useNonEmptyString, useNonZeroBn, useApi } from '@canvas-ui/react-hooks';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import keyring from '@polkadot/ui-keyring';
import { truncate } from '@canvas-ui/react-util';
import { useTxParams } from '@canvas-ui/react-params';
import { extractValues } from '@canvas-ui/react-params/values';
import { u8aToHex } from '@polkadot/util';

// import { ABI, InputMegaGas, InputName, MessageSignature, Params } from './shared';
import { useTranslation } from './translate';

type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

const ENDOWMENT = new BN(1e15);

function defaultContractName (name?: string) {
  return name ? `${name} (instance)` : '';
}

function New ({ allCodes, className, navigateTo }: Props): React.ReactElement<Props> | null {
  const { id, index = '0' }: { id: string, index?: string } = useParams();
  const { t } = useTranslation();
  const { api } = useApi();
  const code = useMemo(
    (): Code | null => {
      return allCodes.find((code: Code) => id === code.id) || null;
      // allCodes.map(({ json: { codeHash, name } }): { text: string; value: string } => ({
      //   text: `${name} (${codeHash})`,
      //   value: codeHash
      // })),
    },
    [allCodes, id]
  );
  const useWeightHook = useGasWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;
  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid] = useNonZeroBn(ENDOWMENT);
  const [constructorIndex, setConstructorIndex] = useState(parseInt(index, 10) || 0);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString(t(defaultContractName(code?.name)));
  const { abi } = useAbi(code);
  const pendingTx = usePendingTx('contracts.instantiate');

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
                asConstructor
                message={constructor}
              />
            ),
            value: `${index}`
          };
        });
    },
    [abi]
  );

  const isValid = useMemo(
    (): boolean => isNameValid && isEndowmentValid && isWeightValid && !!accountId,
    [accountId, isEndowmentValid, isNameValid, isWeightValid]
  );
  // const codeOptions = useMemo(
  //   (): CodeOptions => allCodes.map(({ json: { codeHash, name } }): { text: string; value: string } => ({
  //     text: `${name} (${codeHash})`,
  //     value: codeHash
  //   })),
  //   [allCodes]
  // );

  // const constructor = useMemo(
  //   (): InkConstructor | null => abi?.constructors[constructorIndex] || null,
  //   [abi?.constructors, constructorIndex]
  // );

  // const [params, setParams] = useState<InkMessageParam[]>(abi?.constructors[constructorIndex].args || []);
  // const [values, setValues] = useState<RawParams>(createValues(params));

  const [params, values, setValues] = useTxParams(abi?.constructors[constructorIndex].args || []);
  const encoder = useCallback((): Uint8Array | null => {
    return abi?.constructors[constructorIndex]
      ? abi.constructors[constructorIndex](...extractValues(values || [])) as unknown as Uint8Array
      : null;
  }, [abi?.constructors, constructorIndex, values]);

  // const [data, setData] = useState<Uint8Array | null>(
  //   abi?.constructors[constructorIndex]
  //     ? abi.constructors[constructorIndex](...extractValues(values || [])) as unknown as Uint8Array
  //     : null
  // );

  // useEffect(
  //   (): void => {
  //     // console.log('constructorIndex', constructorIndex);
  //     // console.log('constructor', constructor);
  //     // console.log('values', values);
  //     // console.log('data', data ? u8aToHex(data) : null);
  //     const newParams = abi?.constructors[constructorIndex].args || [];
  //     const defaults = createValues(newParams);
  //     // const encoder = abi?.constructors[constructorIndex];

  //     setParams(newParams);
  //     setValues(defaults);
  //     // setData(
  //     //   encoder
  //     //     ? encoder(...extractValues(defaults)) as unknown as Uint8Array
  //     //     : null
  //     // );
  //   },
  //   [abi, constructorIndex]
  // );

  // useEffect(
  //   (): void => {
  //     const encoder = abi?.constructors[constructorIndex];

  //     setData()
  //   }
  // )

  useEffect(
    (): void => {
      setName(t(defaultContractName(code?.name)));
    },
    [code, setName, t]
  );

  // const data = useMemo(
  //   (): Uint8Array | null => {
  //     let result: Uint8Array | null = null;

  //     if (abi?.constructors[constructorIndex]) {
  //       result = abi.constructors[constructorIndex](...extractValues(values)) as unknown as Uint8Array;
  //     }

  //     return result || null;
  //   },
  //   [abi?.constructors, constructorIndex, values]
  // );

  const _constructCall = useCallback(
    (): any[] => {
      if (!abi || constructorIndex < 0) {
        return [];
      }

      return [endowment, weight, code?.codeHash || null, encoder()];
    },
    [code, constructorIndex, abi, encoder, endowment, weight]
  );

  const _onSuccess = useCallback(
    (result: SubmittableResult): void => {
      const section = api.tx.contracts ? 'contracts' : 'contract';
      const records = result.filterRecords(section, 'Instantiated');

      if (records.length) {
        // find the last EventRecord (in the case of multiple contracts deployed - we should really be
        // more clever here to find the exact contract deployed, this works for eg. Delegator)
        const address = records[records.length - 1].event.data[1] as unknown as AccountId;

        keyring.saveContract(address.toString(), {
          contract: {
            abi: abi?.json || undefined,
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        });

        navigateTo.deploySuccess(address.toString())();
      }
    },
    [abi, api, name, navigateTo]
  );

  const additionalDetails = useMemo(
    (): Record<string, any> => ({
      constructor: constructOptions[constructorIndex]?.text,
      // data: encoder ? u8aToHex(encoder()) : null,
      name: name || '',
      params: params.map((param, index) => ({
        arg: <MessageArg arg={param} />,
        value: values[index].value
      })),
      weight: weight.toString()
    }),
    [name, constructOptions, constructorIndex, params, values, weight]
  );

  useEffect(
    (): void => {
      if (!abi) {
        navigateTo.deploy();
      }
    },
    [abi, navigateTo]
  );

  // if (!contractAbi) {
  //   return null;
  // }

  if (pendingTx.currentItem) {
    return (
      <PendingTx
        additionalDetails={additionalDetails}
        instructions={t<string>('Sign and submite to instantiate this contract derived from the code hash.')}
        {...pendingTx}
      />
    );
  }

  return (
    <div className={className}>
      <header>
        <h1>{t<string>('Deploy {{contractName}}', { replace: { contractName: code?.name || 'Contract' } })}</h1>
        <div className='instructions'>
          {t<string>('Choose an account to deploy the contract from, give it a descriptive name and set the endowment amount.')}
        </div>
      </header>
      <section>
        <InputAddress
          help={t<string>('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
          isInput={false}
          label={t<string>('deployment account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <InputName
          isContract
          isError={isNameError}
          onChange={setName}
          value={name || ''}
        />
        <Labelled label={t<string>('Code Bundle')}>
          <div className='code-bundle'>
            <div className='name'>
              {code?.name || ''}
            </div>
            <div className='code-hash'>
              {truncate(code?.codeHash || '', 16)}
            </div>
          </div>
        </Labelled>
        {abi && (
          <>
            <Dropdown
              help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
              isDisabled={abi.constructors.length <= 1}
              label={t<string>('Deployment Constructor')}
              onChange={setConstructorIndex}
              options={constructOptions}
              value={`${constructorIndex}`}
            />
            <ContractParams
              onChange={setValues}
              params={params || []}
              values={values}
            />
          </>
        )}
        <InputBalance
          help={t<string>('The allotted endowment for this contract, i.e. the amount transferred to the contract upon instantiation.')}
          isError={!isEndowmentValid}
          label={t<string>('endowment')}
          onChange={setEndowment}
          value={endowment}
        />
        <InputMegaGas
          help={t<string>('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
          label={t<string>('maximum gas allowed')}
          {...useWeightHook}
        />
        <Button.Group>
          <TxButton
            accountId={accountId}
            icon='cloud upload'
            isDisabled={!isValid}
            isPrimary
            label={t<string>('Deploy')}
            onSuccess={_onSuccess}
            params={_constructCall}
            tx={
              api.tx.contracts
                ? (
                  !api.tx.contracts.instantiate
                    ? 'contracts.create' // V2 (new)
                    : 'contracts.instantiate' // V2 (old)
                )
                : 'contract.create' // V1
            }
            withSpinner
          />
        </Button.Group>
      </section>
    </div>
  );
}

export default React.memo(styled(New)`
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
      color: var(--grey90);
    }
  }
`);
