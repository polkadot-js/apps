// Copyright 2017-2025 @polkadot/app-contracts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ContractPromise } from '@polkadot/api-contract';
import type { ContractCallOutcome } from '@polkadot/api-contract/types';
import type { WeightV2 } from '@polkadot/types/interfaces';
import type { CallResult } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { Button, Dropdown, Expander, InputAddress, InputBalance, Modal, styled, Toggle, TxButton } from '@polkadot/react-components';
import { useAccountId, useApi, useDebounce, useFormField, useToggle } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_ONE, BN_ZERO } from '@polkadot/util';

import { InputMegaGas, Params } from '../shared/index.js';
import { useTranslation } from '../translate.js';
import useWeight from '../useWeight.js';
import Outcome from './Outcome.js';
import { getCallMessageOptions } from './util.js';

interface Props {
  className?: string;
  contract: ContractPromise;
  messageIndex: number;
  onCallResult?: (messageIndex: number, result?: ContractCallOutcome) => void;
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
  const [estimatedWeightV2, setEstimatedWeightV2] = useState<WeightV2 | null>(null);
  const [value, isValueValid, setValue] = useFormField<BN>(BN_ZERO);
  const [outcomes, setOutcomes] = useState<CallResult[]>([]);
  const [execTx, setExecTx] = useState<SubmittableExtrinsic<'promise'> | null>(null);
  const [params, setParams] = useState<unknown[]>([]);
  const [isViaCall, toggleViaCall] = useToggle();
  const weight = useWeight();
  const dbValue = useDebounce(value);
  const dbParams = useDebounce(params);

  useEffect((): void => {
    setEstimatedWeight(null);
    setEstimatedWeightV2(null);
    setParams([]);
  }, [contract, messageIndex]);

  useEffect((): void => {
    async function dryRun () {
      if (accountId && value && message.isMutating) {
        const dryRunParams: Parameters<typeof api.call.contractsApi.call> =
          [
            accountId,
            contract.address,
            message.isPayable
              ? api.registry.createType('Balance', value)
              : api.registry.createType('Balance', BN_ZERO),
            weight.weightV2,
            null,
            message.toU8a(params)
          ];

        const dryRunResult = await api.call.contractsApi.call(...dryRunParams);

        setExecTx((): SubmittableExtrinsic<'promise'> | null => {
          try {
            return contract.tx[message.method](
              {
                gasLimit: dryRunResult.gasRequired,
                storageDepositLimit: dryRunResult.storageDeposit.isCharge ? dryRunResult.storageDeposit.asCharge : null,
                value: message.isPayable ? value : 0
              },
              ...params
            );
          } catch {
            return null;
          }
        });
      }
    }

    dryRun().catch((e) => console.error(e));
  }, [api, accountId, contract, message, value, weight, params]);

  useEffect((): void => {
    if (!accountId || !message || !dbParams || !dbValue) {
      return;
    }

    contract
      .query[message.method](accountId, { gasLimit: -1, storageDepositLimit: null, value: message.isPayable ? dbValue : 0 }, ...dbParams)
      .then(({ gasRequired, result }) => {
        if (weight.isWeightV2) {
          setEstimatedWeightV2(
            result.isOk
              ? api.registry.createType('WeightV2', gasRequired)
              : null
          );
        } else {
          setEstimatedWeight(
            result.isOk
              ? gasRequired.refTime.toBn()
              : null
          );
        }
      })
      .catch(() => {
        setEstimatedWeight(null);
        setEstimatedWeightV2(null);
      });
  }, [api, accountId, contract, message, dbParams, dbValue, weight.isWeightV2]);

  const _onSubmitRpc = useCallback(
    (): void => {
      if (!accountId || !message || !value || !weight) {
        return;
      }

      contract
        .query[message.method](
          accountId,
          { gasLimit: weight.isWeightV2 ? weight.weightV2 : weight.isEmpty ? -1 : weight.weight, storageDepositLimit: null, value: message.isPayable ? value : 0 },
          ...params
        )
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
    [accountId, contract.query, message, messageIndex, onCallResult, outcomes, params, value, weight]
  );

  const _onClearOutcome = useCallback(
    (outcomeIndex: number) =>
      () => setOutcomes([...outcomes.filter((_, index) => index !== outcomeIndex)]),
    [outcomes]
  );

  const isValid = !!(accountId && weight.isValid && isValueValid);
  const isViaRpc = (isViaCall || (!message.isMutating && !message.isPayable));

  return (
    <StyledModal
      className={`${className} app--contracts-Modal`}
      header={t('Call a contract')}
      onClose={onClose}
    >
      <Modal.Content>
        <InputAddress
          isDisabled
          label={t('contract to use')}
          type='contract'
          value={contract.address}
        />
        <InputAddress
          defaultValue={accountId}
          label={t('call from account')}
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
        {messageIndex !== null && (
          <>
            <Dropdown
              defaultValue={messageIndex}
              isError={message === null}
              label={t('message to send')}
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
            isError={!isValueValid}
            isZeroable
            label={t('value')}
            onChange={setValue}
            value={value}
          />
        )}
        <InputMegaGas
          estimatedWeight={message.isMutating ? estimatedWeight : MAX_CALL_WEIGHT}
          estimatedWeightV2={message.isMutating
            ? estimatedWeightV2
            : api.registry.createType('WeightV2', {
              proofSize: new BN(1_000_000),
              refTIme: MAX_CALL_WEIGHT
            })
          }
          isCall={!message.isMutating}
          weight={weight}
        />
        {message.isMutating && (
          <Toggle
            className='rpc-toggle'
            label={t('read contract only, no execution')}
            onChange={toggleViaCall}
            value={isViaCall}
          />
        )}
        {outcomes.length > 0 && (
          <Expander
            className='outcomes'
            isOpen
            summary={t('Call results')}
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
              label={t('Read')}
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
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
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
`;

export default React.memo(Call);
