// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as Props } from '@canvas-ui/apps/types';
import { RawParams } from '@canvas-ui/react-params/types';
import { InkMessage, InkMessageParam, ContractCallOutcome } from '@canvas-ui/api-contract/types';

import BN from 'bn.js';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { ScrollToTop, Button, ContractParams, Dropdown, InputAddress, InputBalance, InputMegaGas, MessageArg, MessageSignature, PendingTx, TxButton } from '@canvas-ui/react-components';
import { PromiseContract as Contract } from '@canvas-ui/api-contract';
import { useAccountId, useAccountInfo, useApi, useFormField, useGasWeight } from '@canvas-ui/react-hooks';
import { useTxParams } from '@canvas-ui/react-params';
import createValues, { createValue, extractValues } from '@canvas-ui/react-params/values';
import usePendingTx from '@canvas-ui/react-signer/usePendingTx';
import { getContractForAddress } from '@canvas-ui/react-util';
import { BN_ZERO, isNull, u8aToHex } from '@polkadot/util';

import Outcome from './Outcome';
import { useTranslation } from './translate';

type Options = { key: string, text: React.ReactNode, value: number }[];

function getCallMessageOptions (callContract: Contract | null): Options {
  return callContract
    ? callContract.abi.messages.map((message, index): { key: string; text: React.ReactNode; value: number } => {
      return {
        key: message.identifier,
        text: (
          <MessageSignature message={message} />
        ),
        value: index
      };
    })
    : [];
}

function Call ({ className, navigateTo }: Props): React.ReactElement<Props> | null {
  const pageParams: { address?: string, messageIndex?: string } = useParams();
  const { api } = useApi();
  const { t } = useTranslation();
  const { name } = useAccountInfo(pageParams.address?.toString() || null, true);
  const pendingTx = usePendingTx('contracts.call');
  // const { contract, messageIndex, className = '', isOpen, onChangecontractAddress, onChangemessageIndex, onClose } = props;

  const [messageIndex, setMessageIndex] = useState(parseInt(pageParams.messageIndex || '0', 10));
  const [outcomes, setOutcomes] = useState<ContractCallOutcome[]>([]);
  const [contract, hasRpc] = useMemo(
    (): [Contract | null, boolean] => {
      try {
        const contract = getContractForAddress(api, pageParams.address || null);
        const hasRpc = contract?.hasRpcContractsCall || false;

        return [contract, hasRpc];
      } catch (e) {
        console.error(e);

        return [null, false];
      }
    },
    [api, pageParams.address]
  );

  // const [message, setMessage] = useState<InkMessage | null>(contract?.abi.messages[messageIndex] || null);
  const [params, values, setValues] = useTxParams(contract?.abi?.messages[messageIndex].args || []);
  const encoder = useCallback((): Uint8Array | null => {
    return contract?.abi?.messages[messageIndex]
      ? contract.abi.messages[messageIndex](...extractValues(values || [])) as unknown as Uint8Array
      : null;
  }, [contract?.abi?.messages, messageIndex, values]);

  useEffect(
    (): void => {
      const newMessage = contract?.abi?.messages[messageIndex] || null;

      if (hasRpc) {
        if (!newMessage || newMessage.mutates) {
          setUseRpc(false);
        } else {
          setUseRpc(true);
        }
      }
    },
    [contract?.abi?.messages, hasRpc, messageIndex]
  );

  // const [values, setValues] = useState<RawParams>(createValues(message?.args || []));

  // useEffect(
  //   (): void => {
  //     const message = contract?.abi.messages[messageIndex] || null;

  //     setMessage(message);
  //     setValues(createValues(message?.args || []));

  //     if (hasRpc) {
  //       if (!message || message.mutates) {
  //         setUseRpc(false);
  //       } else {
  //         setUseRpc(true);
  //       }
  //     }
  //   },
  //   [contract, messageIndex, hasRpc]
  // );

  const [accountId, setAccountId] = useAccountId();
  const [endowment, setEndowment, isEndowmentValid, isEndowmentError] = useFormField<BN>(BN_ZERO);
  const [useRpc, setUseRpc] = useState(hasRpc && !contract?.abi?.messages[messageIndex].mutates);
  const useWeightHook = useGasWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;

  // const data = useMemo(
  //   (): Uint8Array | null => {
  //     return message ? message(...extractValues(values)) as unknown as Uint8Array : null;
  //   },
  //   [message, values]
  // );
  const messageOptions = useMemo(
    (): Options => getCallMessageOptions(contract),
    [contract]
  );

  useEffect(
    (): void => {
      setOutcomes([]);
    },
    [contract]
  );

  const _constructTx = useCallback(
    (): any[] => {
      const data = encoder();

      if (!accountId || !data || !contract || !contract.address) {
        return [];
      }

      return [contract.address.toString(), endowment, weight, data];
    },
    [accountId, contract, encoder, endowment, weight]
  );

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !contract || !endowment || !weight) return;

      !!contract && contract
        .call('rpc', messageIndex, endowment, weight, ...extractValues(values))
        .send(accountId)
        .then(
          (outcome: ContractCallOutcome): void => {
            setOutcomes([outcome, ...outcomes]);
          }
        );
    },
    [accountId, contract, messageIndex, endowment, weight, outcomes, values]
  );

  // const _onClearOutcomes = useCallback(
  //   (): void => setOutcomes([]),
  //   []
  // );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) => (): void => {
      setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1)));
    },
    [outcomes]
  );

  const isValid = useMemo(
    (): boolean => !!accountId && !!contract && !!contract.address && !!contract.abi && isWeightValid && isEndowmentValid,
    [accountId, contract, isEndowmentValid, isWeightValid]
  );

  const additionalDetails = useMemo(
    (): Record<string, any> => ({
      // data: data ? u8aToHex(data) : null,
      message: messageOptions[messageIndex]?.text,
      name: name || '',
      params: params.map((param, index) => ({
        arg: <MessageArg arg={param} />,
        value: values[index]?.value
      })),
      weight: weight.toString()
    }),
    [name, messageOptions, messageIndex, params, values, weight]
  );

  if (pendingTx.currentItem) {
    return (
      <PendingTx
        additionalDetails={additionalDetails}
        instructions={t<string>('Sign and submit to call the contract message with the above parameters.')}
        {...pendingTx}
      />
    );
  }

  if (isNull(contract) || isNull(messageIndex) || !contract?.abi?.messages[messageIndex]) {
    return null;
  }

  return (
    <div className={className}>
      <ScrollToTop />
      <header>
        <h1>{t<string>('Execute {{name}}', { replace: { name } })}</h1>
        <div className='instructions'>
          {t<string>('Using the unique code hash you can add on-chain contract code for you to deploy.')}
        </div>
      </header>
      <section className={className}>
        {contract && (
          <>
            <InputAddress
              defaultValue={accountId}
              help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
              label={t<string>('Call from Account')}
              onChange={setAccountId}
              type='account'
              value={accountId}
            />
            <Dropdown
              defaultValue={messageIndex}
              help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={messageIndex >= contract?.abi?.messages.length}
              label={t<string>('Message to Send')}
              onChange={setMessageIndex}
              options={messageOptions}
              value={messageIndex}
            />
            <ContractParams
              onChange={setValues}
              params={params}
              values={values}
            />
            <InputBalance
              help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
              isError={isEndowmentError}
              isZeroable
              label={t<string>('Value')}
              onChange={setEndowment}
              value={endowment}
            />
            <InputMegaGas
              help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
              label={t<string>('Maximum Gas Allowed')}
              {...useWeightHook}
            />
            <Dropdown
              onChange={setUseRpc}
              options={[
                {
                  text: t<string>('Send as RPC call'),
                  value: true
                },
                {
                  text: t<string>('Send as transaction'),
                  value: false
                }
              ]}
              value={useRpc}
            />
          </>
        )}
        <Button.Group>
          <Button
            label={t<string>('Cancel')}
            onClick={navigateTo.execute}
          />
          {useRpc
            ? (
              <Button
                isDisabled={!isValid}
                isPrimary
                label={t<string>('Call')}
                onClick={_onSubmitRpc}
              />
            )
            : (
              <TxButton
                accountId={accountId}
                isDisabled={!isValid}
                isPrimary
                label={t<string>('Call')}
                params={_constructTx}
                tx='contracts.call'
              />
            )
          }

        </Button.Group>
      </section>
      {outcomes.length > 0 && (
        <footer>
          <h3>
            {t<string>('Call results')}
            {/* <IconLink
              className='clear-all'
              icon='close'
              label={t<string>('Clear all')}
              onClick={_onClearOutcomes}
            /> */}
          </h3>
          <div className='outcomes'>
            {outcomes.map((outcome, index): React.ReactNode => (
              <Outcome
                key={`outcome-${index}`}
                onClear={_onClearOutcome(index)}
                outcome={outcome}
              />
            ))}
          </div>
        </footer>
      )}
    </div>
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
    > :not(:last-child) {
      margin-bottom: 1rem;
    }
  }
`);
