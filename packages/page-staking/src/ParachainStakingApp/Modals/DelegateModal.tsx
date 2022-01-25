// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available, FormatBalance } from '@polkadot/react-query';
import { BN, BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import { CollatorStateRaw } from '../types';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
  collatorAddress?: Uint8Array;
  minContribution: string
}

function DelegateModal ({ className = '', collatorAddress, minContribution, onClose, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [enoughContribution, setEnoughContribution] = useState(false);
  const [[maxTransfer], setMaxTransfer] = useState<[BN | null]>([null]);
  const [candidateDelegationCount, setCandidateDelegationCount] = useState<BN>(BN_ZERO);
  const [delegationCount, setDelegationCount] = useState<BN>(BN_ZERO);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = collatorAddress;

    // TODO: handle max amount correctly
    if (balances && balances.availableBalance && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.parachainStaking
            ?.delegate(collatorAddress, balances.availableBalance, candidateDelegationCount, delegationCount)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const maxTransfer = balances.availableBalance.sub(adjFee);

              setMaxTransfer(
                [maxTransfer]
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer([null]);
    }
  }, [api, balances, candidateDelegationCount, collatorAddress, delegationCount, propSenderId, senderId]);

  useEffect((): void => {
    if (amount?.lt(new BN(minContribution))) {
      setEnoughContribution(false);
    } else {
      setEnoughContribution(true);
    }
  }, [amount, minContribution]);

  // candidateDelegationCount
  useEffect((): void => {
    setTimeout((): void => {
      api.query.parachainStaking.candidateState(collatorAddress).then((candidateState) => {
        setCandidateDelegationCount(new BN(((candidateState as unknown as CollatorStateRaw).unwrap()).delegators.length));
      }).catch(console.error);
    }, 0);
  }, [api, collatorAddress]);

  // delegationCount
  useEffect((): void => {
    setTimeout((): void => {
      api.query.parachainStaking.delegatorState(senderId).then((delegatorState) => {
        setDelegationCount(new BN(((delegatorState as unknown as {unwrap: () => {delegations: any[]}}).unwrap() as {delegations: any[]}).delegations.length));
      }).catch(console.error);
    }, 0);
  }, [api, collatorAddress, senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Delegate')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>('The delegated amount will be subtracted (along with fees) from the sender account.')}>
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t<string>('delegate from account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={propSenderId || senderId}
                />
              }
              onChange={setSenderId}
              type='allPlus'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('The collator will receive this amount as a delegation.')}>
            <InputAddress
              defaultValue={collatorAddress}
              help={t<string>('Collator Address')}
              isDisabled={!!collatorAddress}
              label={t<string>('delegate to collator address')}
              type='account'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t<string>('Delegate this amount to the collator')}>
            {
              <InputBalance
                autoFocus
                help={<>{t<string>('The minimum amount to delegate is ')}<FormatBalance value={minContribution} /></>}
                isError={!enoughContribution}
                isZeroable
                label={t<string>('amount')}
                labelExtra={<>{t<string>('The minimum amount to delegate is ')}<FormatBalance value={minContribution} /></>}
                maxValue={maxTransfer}
                minValue={new BN(minContribution)}
                onChange={setAmount}
              />
            }
          </Modal.Columns>
          {amount?.lt(new BN(minContribution)) && <MarkError content={'Amount below minimum contribution'} />}
          {maxTransfer && amount?.gt(maxTransfer) && <MarkError content={'Amount above user balance'} />}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!enoughContribution || !(collatorAddress) || !amount || !!recipientPhish}
          label={t<string>('Delegate')}
          onStart={onClose}
          params={
            [collatorAddress, amount, candidateDelegationCount, delegationCount]
          }
          tx={
            api.tx.parachainStaking.delegate
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(DelegateModal)`
  .balance {
    margin-bottom: 0.5rem;
    text-align: right;
    padding-right: 1rem;

    .label {
      opacity: 0.7;
    }
  }

  label.with-help {
    flex-basis: 10rem;
  }

  .typeToggle {
    text-align: right;
  }

  .typeToggle+.typeToggle {
    margin-top: 0.375rem;
  }
`);
