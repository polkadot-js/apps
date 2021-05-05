// Copyright 2017-2021 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BlueprintSubmittableResult } from '@polkadot/api-contract/promise/types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BlueprintPromise } from '@polkadot/api-contract';
import { Dropdown, Input, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useFormField, useNonEmptyString, useNonZeroBn } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { isHex, stringify } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';

import { ENDOWMENT } from '../constants';
import { ABI, InputMegaGas, InputName, MessageSignature, Params } from '../shared';
import store from '../store';
import { useTranslation } from '../translate';
import useAbi from '../useAbi';
import useWeight from '../useWeight';

interface Props {
  codeHash: string;
  constructorIndex: number;
  onClose: () => void;
  setConstructorIndex: React.Dispatch<number>;
}

function Deploy ({ codeHash, constructorIndex = 0, onClose, setConstructorIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const weight = useWeight();
  const [initTx, setInitTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<any[]>([]);
  const [accountId, isAccountIdValid, setAccountId] = useFormField<string | null>(null);
  const [endowment, isEndowmentValid, setEndowment] = useNonZeroBn(ENDOWMENT);
  const [salt, setSalt] = useState(() => randomAsHex());
  const [withSalt, setWithSalt] = useState(false);

  useEffect((): void => {
    setParams([]);
  }, [constructorIndex]);

  const code = useMemo(
    () => store.getCode(codeHash),
    [codeHash]
  );

  const [name, isNameValid, setName] = useNonEmptyString(code && code.json.name);
  const { contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code && code.json.abi, code && code.contractAbi], codeHash, true);

  const blueprint = useMemo(
    () => isAbiValid && codeHash && contractAbi
      ? new BlueprintPromise(api, contractAbi, codeHash)
      : null,
    [api, codeHash, contractAbi, isAbiValid]
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
    endowment && setInitTx((): SubmittableExtrinsic<'promise'> | null => {
      if (blueprint && contractAbi?.constructors[constructorIndex]?.method) {
        try {
          return blueprint.tx[contractAbi.constructors[constructorIndex].method]({
            gasLimit: weight.weight,
            salt: withSalt
              ? salt
              : null,
            value: endowment
          }, ...params);
        } catch (error) {
          return null;
        }
      }

      return null;
    });
  }, [blueprint, contractAbi, constructorIndex, endowment, params, salt, weight, withSalt]);

  const _onSuccess = useCallback(
    (result: BlueprintSubmittableResult): void => {
      if (result.contract) {
        keyring.saveContract(result.contract.address.toString(), {
          contract: {
            abi: stringify(result.contract.abi.json),
            genesisHash: api.genesisHash.toHex()
          },
          name,
          tags: []
        });

        onClose && onClose();
      }
    },
    [api, name, onClose]
  );

  const isSaltValid = !withSalt || (salt && (!salt.startsWith('0x') || isHex(salt)));
  const isValid = isNameValid && isEndowmentValid && weight.isValid && isAccountIdValid && isSaltValid;

  return (
    <Modal header={t('Deploy a contract')}>
      <Modal.Content>
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
          />
        )}
        {contractAbi && (
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
              params={contractAbi.constructors[constructorIndex]?.args}
              registry={contractAbi.registry}
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
        <Input
          help={t<string>('A hex or string value that acts as a salt for this deployment.')}
          isDisabled={!withSalt}
          label={t<string>('unique deployment salt')}
          onChange={setSalt}
          placeholder={t<string>('0x prefixed hex, e.g. 0x1234 or ascii data')}
          value={withSalt ? salt : t<string>('<none>')}
        >
          <Toggle
            isOverlay
            label={t<string>('use deployment salt')}
            onChange={setWithSalt}
            value={withSalt}
          />
        </Input>
        <InputMegaGas
          help={t<string>('The maximum amount of gas that can be used by this deployment, if the code requires more, the deployment will fail.')}
          weight={weight}
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
