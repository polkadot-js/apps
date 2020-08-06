// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { StringOrNull } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button, ButtonCancel, Dropdown, IconLink, InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { useAccountId, useFormField, useToggle } from '@polkadot/react-hooks';
import { createValue } from '@polkadot/react-params/values';
import { BN_ZERO, isNull } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import Outcome from './Outcome';
import { useTranslation } from '../translate';
import { getCallMessageOptions } from './util';
import useWeight from '../useWeight';

interface Props {
  callContract: ApiContract | null;
  callMessageIndex: number | null;
  className?: string;
  isOpen: boolean;
  onChangeCallContractAddress: (callContractAddress: StringOrNull) => void;
  onChangeCallMessageIndex: (callMessageIndex: number) => void;
  onClose: () => void;
}

function Call (props: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { callContract, callMessageIndex, className = '', isOpen, onChangeCallContractAddress, onChangeCallMessageIndex, onClose } = props;
  const hasRpc = callContract?.hasRpcContractsCall;
  const callMessage = callContract?.getMessage(isNull(callMessageIndex) ? undefined : callMessageIndex);

  const [accountId, setAccountId] = useAccountId();
  const [endowment, isEndowmentValid, setEndowment] = useFormField<BN>(BN_ZERO);
  const [isBusy, , setIsBusy] = useToggle();
  const [outcomes, setOutcomes] = useState<ContractCallOutcome[]>([]);
  const [params, setParams] = useState<any[]>(callMessage ? callMessage.def.args.map(({ type }): any => createValue({ type })) : []);
  const [useRpc, setUseRpc] = useState(hasRpc && callMessage && !callMessage.def.mutates);
  const useWeightHook = useWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;

  useEffect((): void => {
    if (callContract && callMessageIndex) {
      const callMessage = callContract.getMessage(callMessageIndex);

      setParams(callMessage ? callMessage.def.args.map(({ type }): any => createValue({ type })) : []);

      if (hasRpc) {
        if (!callMessage || callMessage.def.mutates) {
          setUseRpc(false);
        } else {
          setUseRpc(true);
        }
      }
    }
  }, [callContract, callMessageIndex, hasRpc]);

  useEffect((): void => {
    setOutcomes([]);
  }, [callContract]);

  const _onChangeCallMessageIndexString = useCallback(
    (callMessageIndexString: string): void => {
      onChangeCallMessageIndex && onChangeCallMessageIndex(
        parseInt(callMessageIndexString, 10) || 0
      );
    },
    [onChangeCallMessageIndex]
  );

  const _constructTx = useCallback(
    (): unknown[] => {
      if (!accountId || !callMessage || !callMessage.fn || !callContract || !callContract.address) {
        return [];
      }

      return [callContract.address.toString(), endowment, weight, callMessage.fn(...params)];
    },
    [accountId, callContract, callMessage, endowment, weight, params]
  );

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !callContract || !callMessage || !endowment || !weight) return;

      !!callContract && callContract
        .call('rpc', callMessage.def.name, endowment, weight, ...params)
        .send(accountId)
        .then(
          (outcome: ContractCallOutcome): void => {
            setOutcomes([outcome, ...outcomes]);
          }
        );
    },
    [accountId, callContract, callMessage, endowment, weight, outcomes, params]
  );

  const _onClearOutcomes = useCallback(
    () => setOutcomes([]),
    []
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) => () => setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1))),
    [outcomes]
  );

  const isValid = useMemo(
    (): boolean => !!accountId && !!callContract && !!callContract.address && !!callContract.abi && isWeightValid && isEndowmentValid,
    [accountId, callContract, isEndowmentValid, isWeightValid]
  );

  if (isNull(callContract) || isNull(callMessageIndex) || !callMessage) {
    return null;
  }

  return (
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t<string>('Call a contract')}
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Content>
        {callContract && (
          <div className='contracts--CallControls'>
            <InputAddress
              defaultValue={accountId}
              help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
              isDisabled={isBusy}
              label={t<string>('call from account')}
              onChange={setAccountId}
              type='account'
              value={accountId}
            />
            <InputAddress
              help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
              isDisabled={isBusy}
              label={t<string>('contract to use')}
              onChange={onChangeCallContractAddress}
              type='contract'
              value={callContract.address.toString()}
            />
            {callMessageIndex !== null && (
              <>
                <Dropdown
                  defaultValue={`${callMessage.index}`}
                  help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
                  isDisabled={isBusy}
                  isError={callMessage === null}
                  label={t<string>('message to send')}
                  onChange={_onChangeCallMessageIndexString}
                  options={getCallMessageOptions(callContract)}
                  value={`${callMessage.index}`}
                />
                <Params
                  isDisabled={isBusy}
                  onChange={setParams}
                  params={
                    callMessage
                      ? callMessage.def.args
                      : undefined
                  }
                />
              </>
            )}
            <InputBalance
              help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
              isDisabled={isBusy}
              isError={!isEndowmentValid}
              isZeroable
              label={t<string>('value')}
              onChange={setEndowment}
              value={endowment}
            />
            <InputMegaGas
              help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
              label={t<string>('maximum gas allowed')}
              {...useWeightHook}
            />
          </div>
        )}
        {hasRpc && (
          <Toggle
            className='rpc-toggle'
            label={
              useRpc
                ? t<string>('send as RPC call')
                : t<string>('send as transaction')
            }
            onChange={setUseRpc}
            value={useRpc || false}
          />
        )}
        <Button.Group>
          <ButtonCancel onClick={onClose} />
          {useRpc
            ? (
              <Button
                icon='sign-in-alt'
                isDisabled={!isValid}
                label={t<string>('Call')}
                onClick={_onSubmitRpc}
              />
            )
            : (
              <TxButton
                accountId={accountId}
                icon='sign-in-alt'
                isDisabled={!isValid}
                label={t('Call')}
                onClick={(): void => setIsBusy(true)}
                onFailed={(): void => setIsBusy(false)}
                onSuccess={(): void => setIsBusy(false)}
                params={_constructTx}
                tx='contracts.call'
                withSpinner
              />
            )
          }
        </Button.Group>
        {outcomes.length > 0 && (
          <>
            <h3>
              {t<string>('Call results')}
              <IconLink
                className='clear-all'
                icon='times'
                label={t<string>('Clear all')}
                onClick={_onClearOutcomes}
              />
            </h3>
            <div>
              {outcomes.map((outcome, index): React.ReactNode => (
                <Outcome
                  key={`outcome-${index}`}
                  onClear={_onClearOutcome(index)}
                  outcome={outcome}
                />
              ))}
            </div>
          </>
        )}
      </Modal.Content>
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
`);
