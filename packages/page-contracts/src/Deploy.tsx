// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StringOrNull, VoidFn } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';
import { CodecArg } from '@polkadot/types/types';
import { CodeStored } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import { Dropdown, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useFormField, useNonEmptyString, useNonZeroBn, useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { ABI, InputMegaGas, InputName, MessageSignature, Params } from './shared';
import store from './store';
import { useTranslation } from './translate';
import useAbi from './useAbi';
import useWeight from './useWeight';
import { ENDOWMENT } from './constants';

type CodeOptions = { text: string; value: string }[];
type ConstructOptions = { key: string; text: React.ReactNode; value: string }[];

interface Props {
  basePath: string;
  allCodes: CodeStored[];
  codeHash: string;
  constructorIndex?: number;
  isOpen?: boolean;
  onClose: VoidFn;
  setCodeHash: React.Dispatch<string>;
  setConstructorIndex: React.Dispatch<number>;
}

function defaultContractName (name: string) {
  return `${name} (instance)`;
}

function Deploy ({ allCodes, basePath, codeHash, constructorIndex = 0, isOpen, onClose, setCodeHash, setConstructorIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const history = useHistory();
  const useWeightHook = useWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;

  const code = useMemo(
    (): CodeStored => store.getCode(codeHash),
    [codeHash]
  );
  const [accountId, isAccountIdValid, setAccountId] = useFormField<StringOrNull>(null);
  const [endowment, isEndowmentValid, setEndowment] = useNonZeroBn(new BN(ENDOWMENT));
  const [name, isNameValid, setName] = useNonEmptyString(t(defaultContractName(code.json.name)));
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code.json.abi || null, code.contractAbi || null], codeHash, true);

  const isValid = useMemo(
    (): boolean => isNameValid && isEndowmentValid && isWeightValid && isAccountIdValid,
    [isAccountIdValid, isEndowmentValid, isNameValid, isWeightValid]
  );
  const codeOptions = useMemo(
    (): CodeOptions => allCodes.map(({ json: { codeHash, name } }): { text: string; value: string } => ({
      text: `${name} (${codeHash})`,
      value: codeHash
    })),
    [allCodes]
  );

  const constructOptions = useMemo(
    (): ConstructOptions => {
      if (!contractAbi) {
        return [];
      }

      return contractAbi.abi.contract.constructors.map((message, index) => ({
        key: `${index}`,
        text: (
          <MessageSignature
            asConstructor
            message={message}
          />
        ),
        value: `${index}`
      }));
    },
    [contractAbi]
  );

  const [params, setParams] = useState<unknown[]>(contractAbi && constructorIndex >= 0 ? contractAbi.abi.contract.constructors[constructorIndex].args : []);

  useEffect(
    () => setParams(contractAbi ? contractAbi.abi.contract.constructors[constructorIndex].args : []),
    [constructorIndex, contractAbi]
  );

  useEffect(
    () => setName(t(defaultContractName(code.json.name))),
    [code, setName, t]
  );

  const _constructCall = useCallback(
    (): any[] => {
      if (!contractAbi || constructorIndex < 0) {
        return [];
      }

      return [endowment, weight, codeHash, contractAbi.constructors[constructorIndex](...(params as CodecArg[]))];
    },
    [codeHash, constructorIndex, contractAbi, endowment, params, weight]
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

        history.push(basePath);

        onClose && onClose();
      }
    },
    [abi, api, basePath, history, name, onClose]
  );

  return (
    <Modal
      header={t('Add an existing code hash')}
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Content>
        <InputAddress
          help={t('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
          isInput={false}
          label={t('deployment account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <Dropdown
          defaultValue={
            codeOptions.length
              ? codeOptions[codeOptions.length - 1].value
              : undefined
          }
          help={t('The contract WASM previously deployed. Internally this is identified by the hash of the code, as either created or attached.')}
          label={t('code for this contract')}
          onChange={setCodeHash}
          options={codeOptions}
          value={codeHash}
        />
        <InputName
          isContract
          isError={!isNameValid}
          onChange={setName}
          value={name || ''}
        />
        {
          isAbiSupplied
            ? null
            : (
              <ABI
                contractAbi={contractAbi}
                errorText={errorText}
                isError={isAbiError}
                isSupplied={isAbiSupplied}
                isValid={isAbiValid}
                onChange={onChangeAbi}
                onRemove={onRemoveAbi}
                withLabel
              />
            )
        }
        {
          contractAbi
            ? (
              <Dropdown
                help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
                isDisabled={contractAbi.abi.contract.constructors.length <= 1}
                label={t('deployment constructor')}
                onChange={setConstructorIndex}
                options={constructOptions}
                value={`${constructorIndex}`}
              />
            )
            : null
        }
        <Params
          onChange={setParams}
          params={
            contractAbi && constructorIndex >= 0
              ? contractAbi.abi.contract.constructors[constructorIndex].args
              : []
          }
        />
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
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          icon='upload'
          isDisabled={!isValid}
          label={t('Deploy')}
          onClick={onClose}
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
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Deploy);
