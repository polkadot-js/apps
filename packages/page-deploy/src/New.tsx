// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodeStored } from '@canvas-ui/apps/types';
import { RawParams } from '@canvas-ui/react-params/types';
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
import createValues from '@canvas-ui/react-params/values';
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
    (): CodeStored | undefined => {
      return allCodes.find((code: CodeStored) => id === code.id);
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
  const [name, setName, isNameValid, isNameError] = useNonEmptyString(t(defaultContractName(code?.json.name)));
  const { abi, contractAbi } = useAbi(code);
  const pendingTx = usePendingTx('contracts.instantiate');

  const constructOptions = useMemo(
    (): ConstructOptions => {
      if (!contractAbi) {
        return [];
      }

      return contractAbi.abi.contract.constructors.map(
        (constr, index) => {
          return {
            key: `${index}`,
            text: (
              <MessageSignature
                asConstructor
                message={constr}
              />
            ),
            value: `${index}`
          };
        });
    },
    [contractAbi]
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

  const [params, setParams] = useState<any[]>(
    contractAbi && constructorIndex >= 0 ? contractAbi.abi.contract.constructors[constructorIndex].args : []
  );

  const [values, setValues] = useState<RawParams>(createValues(params));

  useEffect(
    (): void => {
      const newParams = contractAbi ? contractAbi.abi.contract.constructors[constructorIndex].args : [];

      setParams(newParams);
      setValues(createValues(newParams));
    },
    [constructorIndex, contractAbi]
  );

  useEffect(
    (): void => {
      setName(t(defaultContractName(code?.json.name)));
    },
    [code, setName, t]
  );

  const data = useMemo(
    (): Uint8Array | null => {
      return contractAbi?.constructors[constructorIndex](...values.map(({ value }) => value) as any[]) || null;
    },
    [contractAbi, constructorIndex, values]
  );

  const _constructCall = useCallback(
    (): any[] => {
      if (!contractAbi || constructorIndex < 0) {
        return [];
      }

      return [endowment, weight, code?.json.codeHash, data];
    },
    [code, constructorIndex, contractAbi, data, endowment, weight]
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
            abi,
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
      data: data ? u8aToHex(data) : null,
      name: name || '',
      params: params.map((param, index) => ({
        arg: <MessageArg arg={contractAbi?.abi.contract.constructors[constructorIndex].args[index]} />,
        value: values[index].value
      })),
      weight: weight.toString()
    }),
    [contractAbi, data, name, constructOptions, constructorIndex, params, values, weight]
  );

  useEffect(
    (): void => {
      if (!contractAbi) {
        navigateTo.deploy();
      }
    },
    [contractAbi, navigateTo]
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
        <h1>{t<string>('Deploy {{contractName}}', { replace: { contractName: code?.json.name || 'Contract' } })}</h1>
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
              {code?.json.name || ''}
            </div>
            <div className='code-hash'>
              {truncate(code?.json.codeHash || '', 16)}
            </div>
          </div>
        </Labelled>
        {contractAbi && (
          <>
            <Dropdown
              help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
              isDisabled={contractAbi.abi.contract.constructors.length <= 1}
              label={t<string>('Deployment Constructor')}
              onChange={setConstructorIndex}
              options={constructOptions}
              value={`${constructorIndex}`}
            />
            <ContractParams
              onChange={setValues}
              params={
                contractAbi && constructorIndex >= 0
                  ? contractAbi.abi.contract.constructors[constructorIndex].args
                  : []
              }
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
