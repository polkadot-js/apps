// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { CallResult } from './types';

import BN from 'bn.js';
import React, { useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, Expander, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { ContractPromise } from '@polkadot/api-contract';
import { useAccountId, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import Outcome from './Outcome';
import { useTranslation } from '../translate';
import { getCallMessageOptions } from './util';
import useWeight from '../useWeight';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome | void) => void;
  onChangeMessage: (messageIndex: number) => void;
  onClose: () => void;
}

function Call ({ className = '', contract, messageIndex, onCallResult, onChangeMessage, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const message = contract.abi.messages[messageIndex];
  const [accountId, setAccountId] = useAccountId();
  const [estimatedWeight, setEstimatedWeight] = useState<BN | null>(null);
  const [value, isValueValid, setEndowment] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<any[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);

  useEffect((): void => {
    setEstimatedWeight(null);
    setParams([]);
  }, [contract, messageIndex]);

  useEffect((): void => {
    value && message.isMutating && setExecTx((): SubmittableExtrinsic<'promise'> | null => {
      console.error(weight.weight.toString());

      try {
        return contract.exec(message, message.isPayable ? value : 0, weight.weight, ...params);
      } catch (error) {
        return null;
      }
    });
  }, [accountId, contract, message, value, weight, params]);

  useEffect((): void => {
    if (!accountId || !message || !dbParams || !dbValue) return;

    contract
      .read(message, message.isPayable ? dbValue : 0, -1, ...dbParams)
      .send(accountId)
      .then(({ result }) => setEstimatedWeight(
        result.isSuccess
          ? result.asSuccess.gasConsumed
          : null
      ))
      .catch(() => setEstimatedWeight(null));
  }, [accountId, contract, message, dbParams, dbValue]);

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !message || !value || !weight) return;

      contract
        .read(message, message.isPayable ? value : 0, weight.weight, ...params)
        .send(accountId)
        .then((result): void => {
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
    [accountId, contract, message, messageIndex, onCallResult, outcomes, params, value, weight]
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) =>
      () => setOutcomes([...outcomes.filter((_, index) => index !== outcomeIndex)]),
    [outcomes]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = contract.hasRpcContractsCall && (isViaCall || !message.isMutating);

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
            />
          </>
        )}
        {message.isPayable && (
          <InputBalance
            help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isValueValid}
            isZeroable
            label={t<string>('value')}
            onChange={setEndowment}
            value={value}
          />
        )}
        <InputMegaGas
          estimatedWeight={estimatedWeight}
          help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
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
      <Modal.Actions onCancel={onClose}>
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
