// Copyright 2017-2020 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ContractCallOutcome } from '@polkadot/api-contract/types';
import { StringOrNull } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Button, Dropdown, IconLink, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { useAccountId, useFormField } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared';
import Outcome from './Outcome';
import { useTranslation } from '../translate';
import { getCallMessageOptions } from './util';
import useWeight from '../useWeight';

interface Props {
  callContract: ApiContract;
  callMessageIndex: number;
  className?: string;
  onChangeCallContractAddress: (callContractAddress: StringOrNull) => void;
  onChangeCallMessageIndex: (callMessageIndex: number) => void;
  onClose: () => void;
}

function Call ({ callContract, callMessageIndex, className = '', onChangeCallContractAddress, onChangeCallMessageIndex, onClose }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const callMessage = callContract.abi.messages[callMessageIndex];
  const [accountId, setAccountId] = useAccountId();
  const [endowment, isEndowmentValid, setEndowment] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<ContractCallOutcome[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<any[]>([]);
  const useWeightHook = useWeight();
  const { isValid: isWeightValid, weight } = useWeightHook;

  useEffect((): void => {
    setParams([]);
  }, [callContract, callMessageIndex]);

  useEffect((): void => {
    endowment && callMessage.isMutating && setExecTx((): SubmittableExtrinsic<'promise'> | null => {
      try {
        return callContract.exec(callMessage, callMessage.isPayable ? endowment : 0, weight, ...params);
      } catch (error) {
        return null;
      }
    });
  }, [accountId, callContract, callMessage, endowment, weight, params]);

  const _onChangeCallMessageIndexString = useCallback(
    (callMessageIndexString: string): void => {
      onChangeCallMessageIndex && onChangeCallMessageIndex(
        parseInt(callMessageIndexString, 10) || 0
      );
    },
    [onChangeCallMessageIndex]
  );

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !callMessage || !endowment || !weight) return;

      callContract
        .read(callMessage, 0, weight, ...params)
        // when we make calls to mutables, we want the endowment & weight
        // .read(callMessage, endowment, weight, ...params)
        .send(accountId)
        .then((outcome: ContractCallOutcome) => setOutcomes([outcome, ...outcomes]))
        .catch(console.error);
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
    () => !!(accountId && isWeightValid && isEndowmentValid),
    [accountId, isEndowmentValid, isWeightValid]
  );

  const isViaRpc = callContract.hasRpcContractsCall && !callMessage.isMutating;

  return (
    <Modal
      className={[className || '', 'app--contracts-Modal'].join(' ')}
      header={t<string>('Call a contract')}
      onClose={onClose}
    >
      <Modal.Content>
        <InputAddress
          defaultValue={accountId}
          help={t<string>('Specify the user account to use for this contract call. And fees will be deducted from this account.')}
          label={t<string>('call from account')}
          onChange={setAccountId}
          type='account'
          value={accountId}
        />
        <InputAddress
          help={t<string>('A deployed contract that has either been deployed or attached. The address and ABI are used to construct the parameters.')}
          label={t<string>('contract to use')}
          onChange={onChangeCallContractAddress}
          type='contract'
          value={callContract.address.toString()}
        />
        {callMessageIndex !== null && (
          <>
            <Dropdown
              defaultValue={`${callMessageIndex}`}
              help={t<string>('The message to send to this contract. Parameters are adjusted based on the ABI provided.')}
              isError={callMessage === null}
              label={t<string>('message to send')}
              onChange={_onChangeCallMessageIndexString}
              options={getCallMessageOptions(callContract)}
              value={`${callMessageIndex}`}
            />
            <Params
              onChange={setParams}
              params={
                callMessage
                  ? callMessage.args
                  : undefined
              }
            />
          </>
        )}
        {!isViaRpc && callMessage.isPayable && (
          <InputBalance
            help={t<string>('The allotted value for this contract, i.e. the amount transferred to the contract as part of this call.')}
            isError={!isEndowmentValid}
            isZeroable
            label={t<string>('value')}
            onChange={setEndowment}
            value={endowment}
          />
        )}
        <InputMegaGas
          help={t<string>('The maximum amount of gas to use for this contract call. If the call requires more, it will fail.')}
          label={t<string>('maximum gas allowed')}
          {...useWeightHook}
        />
        {outcomes.length > 0 && (
          <div>
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
          </div>
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
              isDisabled={!isValid}
              label={t('Execute')}
              withSpinner
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
`);
