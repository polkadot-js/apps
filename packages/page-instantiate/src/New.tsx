// Copyright 2017-2021 @canvas-ui/app-instantiate authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Code } from '@canvas-ui/react-store/types';
import { Button, Dropdown, Input, InputAddress, InputBalance, InputMegaGas, InputName, Labelled, MessageArg, MessageSignature, Toggle, TxButton } from '@canvas-ui/react-components';
import PendingTx from '@canvas-ui/react-signer/PendingTx'
import { ContractParams } from '@canvas-ui/react-params'
import { ELEV_2_CSS } from '@canvas-ui/react-components/styles/constants';
import { useAbi, useAccountId, useApi, useGasWeight, useNonEmptyString, useNonZeroBn, useAppNavigation } from '@canvas-ui/react-hooks';
import useTxParams from '@canvas-ui/react-components/Params/useTxParams';
import { extractValues } from '@canvas-ui/react-components/Params/values';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import { truncate } from '@canvas-ui/react-util';
import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { BlueprintPromise as Blueprint } from '@polkadot/api-contract';
import { AccountId } from '@polkadot/types/interfaces';
import keyring from '@polkadot/ui-keyring';
import { randomAsHex } from '@polkadot/util-crypto';

// import { ABI, InputMegaGas, InputName, MessageSignature, Params } from './shared';
import { useTranslation } from './translate';
import { ComponentProps as Props } from './types';

type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

const ENDOWMENT = new BN(1e15);

function defaultContractName (name?: string) {
  return name ? `${name} (instance)` : '';
}

function New ({ allCodes, className }: Props): React.ReactElement<Props> | null {
  const { id, index = '0' }: { id: string, index?: string } = useParams();
  const { t } = useTranslation();
  const { api } = useApi();
  const { navigateTo } = useAppNavigation();
  const code = useMemo(
    (): Code | null => {
      return allCodes.find((code: Code) => id === code.id) || null;
    },
    [allCodes, id]
  );
  const useWeightHook = useGasWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;
  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid] = useNonZeroBn(ENDOWMENT);
  const [constructorIndex, setConstructorIndex] = useState(parseInt(index, 10) || 0);
  const [name, setName, isNameValid, isNameError] = useNonEmptyString(t(defaultContractName(code?.name)));
  const { abi, isAbiValid } = useAbi(code);
  const [salt, setSalt] = useState(randomAsHex());
  const [withSalt, setWithSalt] = useState(false);
  const [initTx, setInitTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const pendingTx = usePendingTx('contracts.instantiate');

  const blueprint = useMemo(
    () => isAbiValid && code?.codeHash && abi
      ? new Blueprint(api, abi, code.codeHash)
      : null,
    [api, code?.codeHash, abi, isAbiValid]
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
    (): boolean => isNameValid && isEndowmentValid && isWeightValid && !!accountId,
    [accountId, isEndowmentValid, isNameValid, isWeightValid]
  );

  const [params, values = [], setValues] = useTxParams(abi?.constructors[constructorIndex].args || []);

  useEffect((): void => {
    endowment && setInitTx((): SubmittableExtrinsic<'promise'> | null => {
      if (blueprint) {
        try {
          const identifier = abi?.constructors[constructorIndex].identifier;

          return identifier ? blueprint.tx[identifier]({ gasLimit: weight.toString(), salt: withSalt ? salt : null, value: endowment }, ...extractValues(values)) : null;
        } catch (error) {
          console.error(error);

          return null;
        }
      }

      return null;
    });
  }, [abi, blueprint, constructorIndex, endowment, values, weight, salt, withSalt]);

  useEffect(
    (): void => {
      setName(t(defaultContractName(code?.name)));
    },
    [code, setName, t]
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

        navigateTo.instantiateSuccess(address.toString())();
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
        arg: (
          <MessageArg
            arg={param}
            registry={abi?.registry}
          />
        ),
        type: param.type,
        value: values[index].value
      })),
      weight: weight.toString()
    }),
    [abi?.registry, name, constructOptions, constructorIndex, params, values, weight]
  );

  useEffect(
    (): void => {
      if (!abi) {
        navigateTo.instantiate();
      }
    },
    [abi, navigateTo]
  );

  return (
    <PendingTx
      additionalDetails={additionalDetails}
      instructions={t<string>('Sign and submit to instantiate this contract derived from the code hash.')}
      registry={abi?.registry}
      {...pendingTx}
    >
      <div className={className}>
        <header>
          <h1>{t<string>('Instantiate {{contractName}}', { replace: { contractName: code?.name || 'Contract' } })}</h1>
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
                help={t<string>('The instantiation constructor information for this contract, as provided by the ABI.')}
                isDisabled={abi.constructors.length <= 1}
                label={t<string>('Instantiation Constructor')}
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
          <Button.Group>
            <TxButton
              accountId={accountId}
              extrinsic={initTx}
              icon='cloud-upload-alt'
              isDisabled={!isValid}
              isPrimary
              label={t<string>('Instantiate')}
              onSuccess={_onSuccess}
              withSpinner
            />
          </Button.Group>
        </section>
      </div>
    </PendingTx>
  );
}

export default React.memo(styled(New)`
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
