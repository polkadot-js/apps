// Copyright 2017-2022 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { CallResult } from './types';

import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Dropdown, Expander, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import { useTranslation } from '../translate';
import useWeight from '../useWeight';
import Outcome from './Outcome';
import { getCallMessageOptions } from './util';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

const MAX_CALL_WEIGHT = new BN(5_000_000_000_000).isub(BN_ONE);

function Call ({ className = '', contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const message = contract.abi.messages[messageIndex];
  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);
  const hasStorageDeposit = api.tx.contracts.call.meta.args.length === 5;

  useEffect((): void => {
    setEstimatedWeight(null);
    setParams([]);
  }, [contract, messageIndex]);

  useEffect((): void => {
    value && message.isMutating && setExecTx((): SubmittableExtrinsic<'promise'> | null => {
      try {
        return hasStorageDeposit
          ? contract.tx[message.method]({ gasLimit: weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 }, ...params)
          : contract.tx[message.method]({ gasLimit: weight.weight, value: message.isPayable ? value : 0 }, ...params);
      } catch (error) {
        return null;
      }
    });
  }, [accountId, contract, message, value, weight, params, hasStorageDeposit]);

  useEffect((): void => {
    if (!accountId || !message || !dbParams || !dbValue) return;
    const query = hasStorageDeposit
      ? contract.query[message.method](accountId, { gasLimit: -1, storageDepositLimit: null, value: message.isPayable ? dbValue : 0 }, ...dbParams)
      : contract.query[message.method](accountId, { gasLimit: -1, value: message.isPayable ? dbValue : 0 }, ...dbParams);

    query
      .then(({ gasRequired, result }) => setEstimatedWeight(
        result.isOk
          ? gasRequired
          : null
      ))
      .catch(() => setEstimatedWeight(null));
  }, [accountId, contract, message, dbParams, dbValue, hasStorageDeposit]);

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !message || !value || !weight) return;
      const query = hasStorageDeposit
        ? contract.query[message.method](accountId, { gasLimit: weight.isEmpty ? -1 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 }, ...params)
        : contract.query[message.method](accountId, { gasLimit: weight.isEmpty ? -1 : weight.weight, value: message.isPayable ? value : 0 }, ...params);

      query.then((result): void => {
        setOutcomes([{
          ...result,
          from: accountId,
          message,
          params,
          when: new Date()
        }, ...outcomes]);
        onCallResult && onCallResult(messageIndex, result);
      })
        .catch((error): void => {
          console.error(error);
          onCallResult && onCallResult(messageIndex);
        });
    },
    [accountId, contract.query, hasStorageDeposit, message, messageIndex, onCallResult, outcomes, params, value, weight]
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) =>
      () => setOutcomes([...outcomes.filter((_, index) => index !== outcomeIndex)]),
    [outcomes]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = contract.hasRpcContractsCall && (isViaCall || (!message.isMutating && !message.isPayable));

  return (
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t<string>('Call a contract')}
      onClose={onClose}
    >
      <Modal.Content>
        <InputAddress
          help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          isDisabled
          label={t<string>('contract to use')}
          type='contract'
          value={contract.address}
        />
        <InputAddress
          defaultValue={accountId}
          help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t<string>('call from account')}
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
        {messageIndex !== null && (
          <>
            <Dropdown
              defaultValue={messageIndex}
              help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={message === null}
              label={t<string>('message to send')}
              onChange={onChangeMessage}
              options={getCallMessageOptions(contract)}
              value={messageIndex}
            />
            <Params
              onChange={setParams}
              params={
                message
                  ? message.args
                  : undefined
              }
              registry={contract.abi.registry}
            />
          </>
        )}
        {message.isPayable && (
          <InputBalance
            help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isValueValid}
            isZeroable
            label={t<string>('value')}
            onChange={setValue}
            value={value}
          />
        )}
        <InputMegaGas
          estimatedWeight={message.isMutating ? estimatedWeight : MAX_CALL_WEIGHT}
          help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
          isCall={!message.isMutating}
          weight={weight}
        />
        {message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t<string>('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}
        {outcomes.length > 0 && (
          <Expander
            className='outcomes'
            isOpen
            summary={t<string>('Call results')}
          >
            {outcomes.map((outcome, index): React.ReactNode => (
              <Outcome
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
          </Expander>
        )}
      </Modal.Content>
      <Modal.Actions>
        {isViaRpc
          ? (
            <Button
              icon='sign-in-alt'
              isDisabled={!isValid}
              label={t<string>('Read')}
              onClick={_onSubmitRpc}
            />
          )
          : (
            <TxButton
              accountId={accountId}
              extrinsic={execTx}
              icon='sign-in-alt'
              isDisabled={!isValid || !execTx}
              label={t('Execute')}
              onStart={onClose}
            />
          )
        }
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Call)`
  .rpc-toggle {
    margin-top: 1rem;
    display: flex;
    justify-content: flex-end;
  }

  .clear-all {
    float: right;
  }

  .outcomes {
    margin-top: 1rem;
  }
`);
