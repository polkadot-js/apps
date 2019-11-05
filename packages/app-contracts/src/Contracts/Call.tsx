// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { ApiProps } from '@polkadot/react-api/types';
import { BareProps, I18nProps, StringOrNull } from '@polkadot/react-components/types';
import { ContractExecResult } from '@polkadot/types/interfaces/contracts';

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, IconLink, InputAddress, InputBalance, InputNumber, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { withApi, withMulti } from '@polkadot/react-api';
import { createValue } from '@polkadot/react-params/values';
import { isNull } from '@polkadot/util';

import Params from '../Params';
import Outcome from './Outcome';

import translate from '../translate';
import { GAS_LIMIT } from '../constants';
import { getCallMessageOptions } from './util';

interface Props extends BareProps, I18nProps, ApiProps {
  callContract: ApiContract | null;
  callMessageIndex: number | null;
  callResults: ContractExecResult[];
  isOpen: boolean;
  onChangeCallContractAddress: (callContractAddress: StringOrNull) => void;
  onChangeCallMessageIndex: (callMessageIndex: number) => void;
  onClose: () => void;
}

function Call (props: Props): React.ReactElement<Props> | null {
  const { className, isOpen, callContract, callMessageIndex, onChangeCallContractAddress, onChangeCallMessageIndex, onClose, api, t } = props;

  if (isNull(callContract) || isNull(callMessageIndex)) {
    return null;
  }

  const hasRpc = api.rpc.contracts && api.rpc.contracts.call;
  let callMessage = callContract.getMessage(callMessageIndex);

  const [accountId, setAccountId] = useState<StringOrNull>(null);
  const [endowment, setEndowment] = useState<BN>(new BN(0));
  const [gasLimit, setGasLimit] = useState<BN>(new BN(GAS_LIMIT));
  const [isBusy, setIsBusy] = useState(false);
  const [outcomes, setOutcomes] = useState<ContractCallOutcome[]>([]);
  const [params, setParams] = useState<any[]>(callMessage ? callMessage.def.args.map(({ type }): any => createValue({ type })) : []);
  const [useRpc, setUseRpc] = useState(callMessage && !callMessage.def.mutates);

  useEffect((): void => {
    callMessage = callContract.getMessage(callMessageIndex);

    setParams(callMessage ? callMessage.def.args.map(({ type }): any => createValue({ type })) : []);
    if (!callMessage || callMessage.def.mutates) {
      setUseRpc(false);
    } else {
      setUseRpc(true);
    }
  }, [callContract, callMessageIndex]);

  useEffect((): void => {
    setOutcomes([]);
  }, [callContract]);

  const _onChangeAccountId = (accountId: StringOrNull): void => setAccountId(accountId);

  const _onChangeCallMessageIndexString = (callMessageIndexString: string): void => {
    onChangeCallMessageIndex && onChangeCallMessageIndex(
      parseInt(callMessageIndexString, 10) || 0
    );
  };

  const _onChangeEndowment = (endowment?: BN): void => endowment && setEndowment(endowment);
  const _onChangeGasLimit = (gasLimit?: BN): void => gasLimit && setGasLimit(gasLimit);

  const _onChangeParams = (params: any[]): void => setParams(params);
  const _toggleBusy = (): void => setIsBusy(!isBusy);

  const _constructTx = (): any[] => {
    if (!accountId || !callMessage || !callMessage.fn || !callContract || !callContract.address) {
      return [];
    }

    return [callContract.address.toString(), endowment, gasLimit, callMessage.fn(...params)];
  };

  const _onSubmitRpc = (): void => {
    if (!accountId) return;

    callContract
      .call('rpc', callMessage.def.name, endowment, gasLimit, ...params)
      .send(accountId)
      .then(
        (outcome: ContractCallOutcome): void => {
          setOutcomes([outcome, ...outcomes]);
        }
      );
  };

  const _onClearOutcomes = (): void => setOutcomes([]);
  const _onClearOutcome = (outcomeIndex: number) => (): void => {
    setOutcomes(outcomes.slice(0, outcomeIndex).concat(outcomes.slice(outcomeIndex + 1)));
  };

  const isEndowmentValid = true;
  const isGasValid = !gasLimit.isZero();
  const isValid = !!accountId && isEndowmentValid && isGasValid && callContract && callContract.address && callContract.abi;

  return (
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      dimmer='inverted'
      onClose={onClose}
      open={isOpen}
    >
      <Modal.Header>
        {t('Call a contract')}
      </Modal.Header>
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
              label={t('value')}
              onChange={_onChangeEndowment}
              value={endowment}
            />
            <InputNumber
              defaultValue={gasLimit}
              help={t('The maximum amount of gas that can be used by this call. If the code requires more, the call will fail.')}
              isDisabled={isBusy}
              isError={!isGasValid}
              label={t('maximum gas allowed')}
              onChange={_onChangeGasLimit}
              value={gasLimit}
            />
          </div>
        )}
        {hasRpc && (
          <Toggle
            className='rpc-toggle'
            isDisabled={!!callMessage && callMessage.def.mutates}
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
          <Button
            icon='cancel'
            isNegative
            onClick={onClose}
            label={t('Cancel')}
          />
          <Button.Or />
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
                onClick={_toggleBusy}
                onFailed={_toggleBusy}
                onSuccess={_toggleBusy}
                params={_constructTx}
                tx={api.tx.contracts ? 'contracts.call' : 'contract.call'}
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

export default withMulti(
  styled(Call)`
    .rpc-toggle {
      margin-top: 1rem;
      display: flex;
      justify-content: flex-end;
    }

    .clear-all {
      float: right;
    }
  `,
  translate,
  withApi
);
