// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { BareProps, StringOrNull } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button, ButtonCancel, Dropdown, IconLink, InputAddress, InputBalance, InputNumber, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { createValue } from '@polkadot/react-params/values';
import { isNull } from '@polkadot/util';

import { InputGas, Params } from '../shared';
import Outcome from './Outcome';

import { useTranslation } from '../translate';
import { GAS_LIMIT } from '../constants';
import { getCallMessageOptions } from './util';

interface Props extends BareProps {
  callContract: ApiContract | null;
  callMessageIndex: number | null;
  isOpen: boolean;
  onChangeCallContractAddress: (callContractAddress: StringOrNull) => void;
  onChangeCallMessageIndex: (callMessageIndex: number) => void;
  onClose: () => void;
}

function Call (props: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { callContract, callMessageIndex, className, isOpen, onChangeCallContractAddress, onChangeCallMessageIndex, onClose } = props;
  const hasRpc = callContract?.hasRpcContractsCall;
  const callMessage = callContract?.getMessage(isNull(callMessageIndex) ? undefined : callMessageIndex);

  const { api } = useApi();
  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [endowment, setEndowment] = useState<BN>(new BN(0));
  const [gasLimit, setGasLimit] = useState<BN>(new BN(GAS_LIMIT));
  const [isBusy, toggleIsBusy, setIsBusy] = useToggle();
  const [outcomes, setOutcomes] = useState<ContractCallOutcome[]>([]);
  const [params, setParams] = useState<any[]>(callMessage ? callMessage.def.args.map(({ type }): any => createValue({ type })) : []);
  const [useRpc, setUseRpc] = useState(hasRpc && callMessage && !callMessage.def.mutates);

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

  const _onChangeAccountId = useCallback(
    (accountId: StringOrNull): void => setAccountId(accountId),
    []
  );

  const _onChangeCallMessageIndexString = useCallback(
    (callMessageIndexString: string): void => {
      onChangeCallMessageIndex && onChangeCallMessageIndex(
        parseInt(callMessageIndexString, 10) || 0
      );
    },
    [onChangeCallMessageIndex]
  );

  const _onChangeEndowment = useCallback(
    (endowment?: BN): void => endowment && setEndowment(endowment),
    []
  );
  const _onChangeGasLimit = useCallback(
    (gasLimit?: BN): void => gasLimit && setGasLimit(gasLimit),
    []
  );

  const _onChangeParams = useCallback(
    (params: any[]): void => setParams(params),
    []
  );
  // const _toggleBusy = useCallback(
  //   (): void => setIsBusy(!isBusy),
  //   [isBusy]
  // );

  const _constructTx = useCallback(
    (): any[] => {
      if (!accountId || !callMessage || !callMessage.fn || !callContract || !callContract.address) {
        return [];
      }

      return [callContract.address.toString(), endowment, gasLimit, callMessage.fn(...params)];
    },
    [accountId, callContract, callMessage, endowment, gasLimit, params]
  );

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !callMessage) return;

      callContract && callContract
        .call('rpc', callMessage.def.name, endowment, gasLimit, ...params)
        .send(accountId)
        .then(
          (outcome: ContractCallOutcome): void => {
            setOutcomes([outcome, ...outcomes]);
          }
        );
    },
    [accountId, callContract, callMessage, endowment, gasLimit, outcomes, params]
  );

  const _onClearOutcomes = useCallback(
    (): void => setOutcomes([]),
    []
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) => (): void => {
      setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1)));
    },
    [outcomes]
  );

  const [isEndowmentValid, isGasLimitValid, isValid] = useMemo(
    (): [boolean, boolean, boolean] => {
      const isEndowmentValid = true;
      const isGasLimitValid = !gasLimit.isZero();

      return [
        isEndowmentValid,
        isGasLimitValid,
        !!accountId && isEndowmentValid && isGasLimitValid && !!callContract && !!callContract.address && !!callContract.abi
      ];
    },
    [accountId, callContract, gasLimit]
  );

  if (isNull(callContract) || isNull(callMessageIndex) || !callMessage) {
    return null;
  }

  return (
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t('Call a contract')}
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Content>
        {callContract && (
          <div className='contracts--CallControls'>
            <InputAddress
              defaultValue={accountId}
              help={t('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
              isDisabled={isBusy}
              label={t('call from account')}
              onChange={_onChangeAccountId}
              type='account'
              value={accountId}
            />
            <InputAddress
              help={t('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
              isDisabled={isBusy}
              label={t('contract to use')}
              onChange={onChangeCallContractAddress}
              type='contract'
              value={callContract.address.toString()}
            />
            {callMessageIndex !== null && (
              <>
                <Dropdown
                  defaultValue={`${callMessage.index}`}
                  help={t('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
                  isDisabled={isBusy}
                  isError={callMessage === null}
                  label={t('message to send')}
                  onChange={_onChangeCallMessageIndexString}
                  options={getCallMessageOptions(callContract)}
                  value={`${callMessage.index}`}
                />
                <Params
                  isDisabled={isBusy}
                  onChange={_onChangeParams}
                  params={
                    callMessage
                      ? callMessage.def.args
                      : undefined
                  }
                />
              </>
            )}
            <InputBalance
              help={t('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
              isDisabled={isBusy}
              isError={!isEndowmentValid}
              isZeroable
              label={t('value')}
              onChange={_onChangeEndowment}
              value={endowment}
            />
            <InputGas
              isError={!isGasLimitValid}
              onChange={_onChangeGasLimit}
              value={gasLimit}
            />
          </div>
        )}
        {hasRpc && (
          <Toggle
            className='rpc-toggle'
            label={
              useRpc
                ? t('send as RPC call')
                : t('send as transaction')
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
                icon='sign-in'
                isDisabled={!isValid}
                isPrimary
                label={t('Call')}
                onClick={_onSubmitRpc}
              />
            )
            : (
              <TxButton
                accountId={accountId}
                icon='sign-in'
                isDisabled={!isValid}
                isPrimary
                label={t('Call')}
                onClick={(): void => setIsBusy(true)}
                onFailed={(): void => setIsBusy(false)}
                onSuccess={(): void => setIsBusy(false)}
                params={_constructTx}
                tx={api.tx.contracts ? 'contracts.call' : 'contract.call'}
                withSpinner
              />
            )
          }
        </Button.Group>
        {outcomes.length > 0 && (
          <>
            <h3>
              {t('Call results')}
              <IconLink
                className='clear-all'
                icon='close'
                label={t('Clear all')}
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
