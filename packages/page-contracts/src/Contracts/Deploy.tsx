// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { BlueprintSubmittableResult } from '@polkadot/api-contract/promise/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { BlueprintPromise } from '@polkadot/api-contract';
import { Dropdown, Input, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useFormField, useNonEmptyString } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { keyring } from '@polkadot/ui-keyring';
import { BN_ZERO, isHex, stringify } from '@polkadot/util';
import { randomAsHex } from '@polkadot/util-crypto';

import { ABI, InputMegaGas, InputName, MessageSignature, Params } from '../shared/index.js';
import store from '../store.js';
import { useTranslation } from '../translate.js';
import useAbi from '../useAbi.js';
import useWeight from '../useWeight.js';

interface Props {
  codeHash: string;
  constructorIndex: number;
  onClose: () => void;
  setConstructorIndex: React.Dispatch<number>;
}

function Deploy ({ codeHash, constructorIndex = 0, onClose, setConstructorIndex }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [initTx, setInitTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [accountId, isAccountIdValid, setAccountId] = useFormField<string | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [params, setParams] = useState<unknown[]>([]);
  const [salt, setSalt] = useState<string>(() => randomAsHex());
  const [withSalt, setWithSalt] = useState(false);
  const weight = useWeight();

  useEffect((): void => {
    setParams([]);
  }, [constructorIndex]);

  const code = useMemo(
    () => store.getCode(codeHash),
    [codeHash]
  );

  const [name, isNameValid, setName] = useNonEmptyString(code?.json.name);
  const { contractAbi, errorText, isAbiError, isAbiSupplied, isAbiValid, onChangeAbi, onRemoveAbi } = useAbi([code?.json.abi, code?.contractAbi], codeHash, true);

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
    value && setInitTx((): SubmittableExtrinsic<'promise'> | null => {
      if (blueprint && contractAbi?.constructors[constructorIndex]?.method) {
        try {
          return blueprint.tx[contractAbi.constructors[constructorIndex].method]({
            gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.weight,
            salt: withSalt
              ? salt
              : null,
            storageDepositLimit: null,
            value: contractAbi?.constructors[constructorIndex].isPayable ? value : undefined
          }, ...params);
        } catch {
          return null;
        }
      }

      return null;
    });
  }, [blueprint, contractAbi, constructorIndex, value, params, salt, weight, withSalt]);

  const _onSuccess = useCallback(
    (result: BlueprintSubmittableResult): void => {
      if (result.contract) {
        keyring.saveContract(result.contract.address.toString(), {
          contract: {
            abi: stringify(result.contract.abi.json),
            genesisHash: api.genesisHash.toHex()
          },
          name: name || undefined,
          tags: []
        });

        onClose && onClose();
      }
    },
    [api, name, onClose]
  );

  const isSaltValid = !withSalt || (salt && (!salt.startsWith('0x') || isHex(salt)));
  const isValid = isNameValid && isValueValid && weight.isValid && isAccountIdValid && isSaltValid;

  return (
    <Modal
      header={t('Deploy a contract')}
      onClose={onClose}
    >
      <Modal.Content>
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
        {contractAbi?.constructors[constructorIndex].isPayable && (
          <InputBalance
            isError={!isValueValid}
            isZeroable
            label={t('value')}
            onChange={setValue}
            value={value}
          />
        )}
        <Input
          isDisabled={!withSalt}
          label={t('unique deployment salt')}
          labelExtra={
            <Toggle
              label={t('use deployment salt')}
              onChange={setWithSalt}
              value={withSalt}
            />
          }
          onChange={setSalt}
          placeholder={t('0x prefixed hex, e.g. 0x1234 or ascii data')}
          value={withSalt ? salt : t('<none>')}
        />
        <InputMegaGas
          weight={weight}
        />
      </Modal.Content>
      <Modal.Actions>
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
