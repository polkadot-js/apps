// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { StringOrNull } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';
import { CodeStored } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { SubmittableResult } from '@polkadot/api';
import { PromiseBlueprint } from '@polkadot/api-contract';
import { Dropdown, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useFormField, useNonEmptyString, useNonZeroBn, useApi } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';

import { ABI, InputMegaGas, InputName, MessageSignature, Params } from './shared';
import store from './store';
import { useTranslation } from './translate';
import useAbi from './useAbi';
import useWeight from './useWeight';
import { ENDOWMENT } from './constants';

interface Props {
  basePath: string;
  codeHash: string;
  constructorIndex: number;
  onClose: () => void;
  setConstructorIndex: React.Dispatch<number>;
}

function Deploy ({ basePath, codeHash, constructorIndex = 0, onClose, setConstructorIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const history = useHistory();
  const weight = useWeight();
  const [initTx, setInitTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<any[]>([]);
  const [accountId, isAccountIdValid, setAccountId] = useFormField<StringOrNull>(null);
  const [endowment, isEndowmentValid, setEndowment] = useNonZeroBn(new BN(ENDOWMENT));

  useEffect((): void => {
    setParams([]);
  }, [constructorIndex]);

  const code = useMemo(
    (): CodeStored => store.getCode(codeHash),
    [codeHash]
  );

  const [name, isNameValid, setName] = useNonEmptyString(code.json.name);
  const { abi, contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code.json.abi, code.contractAbi], codeHash, true);

  const blueprint = useMemo(
    () => codeHash && contractAbi
      ? new PromiseBlueprint(api, contractAbi, codeHash)
      : null,
    [api, codeHash, contractAbi]
  );

  const constructOptions = useMemo(
    () => contractAbi
      ? contractAbi.constructors.map((message, index) => ({
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
    endowment && setInitTx((): SubmittableExtrinsic<'promise'> | null => {
      if (blueprint) {
        try {
          return blueprint.instantiate(constructorIndex, endowment, weight.weight, ...params);
        } catch (error) {
          console.error(error);

          return null;
        }
      }

      return null;
    });
  }, [blueprint, constructorIndex, endowment, params, weight]);

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

  const isValid = isNameValid && isEndowmentValid && weight.isValid && isAccountIdValid;

  return (
    <Modal header={t('Add an existing code hash')}>
      <Modal.Content>
        <InputAddress
          help={t('Specify the user account to use for this deployment. Any fees will be deducted from this account.')}
          isInput={false}
          label={t('deployment account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <InputName
          isContract
          isError={!isNameValid}
          onChange={setName}
          value={name || ''}
        />
        {!isAbiSupplied && (
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
        )}
        {contractAbi && (
          <Dropdown
            help={t<string>('The deployment constructor information for this contract, as provided by the ABI.')}
            isDisabled={contractAbi.constructors.length <= 1}
            label={t('deployment constructor')}
            onChange={setConstructorIndex}
            options={constructOptions}
            value={constructorIndex}
          />
        )}
        <Params
          onChange={setParams}
          params={
            contractAbi
              ? contractAbi.constructors[constructorIndex].args
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
          {...weight}
        />
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={accountId}
          extrinsic={initTx}
          icon='upload'
          isDisabled={!isValid || !initTx}
          label={t('Deploy')}
          onClick={onClose}
          onSuccess={_onSuccess}
          withSpinner
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Deploy);
