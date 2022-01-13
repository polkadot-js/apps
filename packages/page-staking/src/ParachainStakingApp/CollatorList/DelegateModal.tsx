// Copyright 2017-2022 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, MarkError, MarkWarning, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available, FormatBalance } from '@polkadot/react-query';
import { BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
  collatorAddress?: Uint8Array;
  minContribution:string
}


function DelegateModal ({ className = '', onClose, collatorAddress, senderId: propSenderId,minContribution }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [enoughContribution,setEnoughContribution] = useState(false);
  const [isProtected, setIsProtected] = useState(true);
  const [isAll, setIsAll] = useState(false);
  const [[maxTransfer, noFees], setMaxTransfer] = useState<[BN | null, boolean]>([null, false]);
  const [candidateDelegationCount, setCandidateDelegationCount] = useState<BN>(BN_ZERO);
  const [delegationCount, setDelegationCount] = useState<BN>(BN_ZERO);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(api.query.system.account, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = collatorAddress || recipientId as string;
    console.log("maxTransfer",maxTransfer)
    console.log(balances && balances.accountId?.eq(fromId) && fromId && toId && isFunction(api.rpc.payment?.queryInfo))

    // TODO: handle max amount correctly
    if (balances && balances.accountId?.eq(fromId) && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.balances
            ?.transfer(toId, balances.availableBalance)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const maxTransfer = balances.availableBalance.sub(adjFee);

              setMaxTransfer(
                  [maxTransfer, false]
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer([null, false]);
    }
  }, [api, balances, collatorAddress, propSenderId, recipientId, senderId]);


  useEffect((): void => {
    if (amount?.lt(new BN(minContribution))){
      setEnoughContribution(false)
    } else {
      setEnoughContribution(true)
    }
  }, [amount]);

  // candidateDelegationCount
  useEffect((): void => {
    api.query.parachainStaking.candidateState(collatorAddress).then((candidateState:any)=>{
      setCandidateDelegationCount(candidateState.unwrap().delegators.length)
    })
  }, [collatorAddress]);

  // delegationCount
  useEffect((): void => {
    api.query.parachainStaking.delegatorState(senderId).then((delegatorState:any)=>{
      setDelegationCount(delegatorState.unwrap().delegations.length)
    }).catch(console.error);
  }, [collatorAddress,senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send funds')}
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
          <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
            <InputAddress
              defaultValue={collatorAddress}
              help={t<string>('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!collatorAddress}
              label={t<string>('delegate to collator address')}
              type='account'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t<string>('If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.')}>
            {
                <InputBalance
                    autoFocus
                    help={<>{t<string>('The minimum amount to delegate is ')}<FormatBalance value={minContribution} /></>}
                    isError={!enoughContribution}
                    isZeroable
                    label={t<string>('amount')}
                    minValue={new BN(minContribution)}
                    maxValue={maxTransfer}
                    onChange={setAmount}
                />
            }
          </Modal.Columns>
          {amount?.lt(new BN(minContribution))&&<MarkError content={"Amount below minimum contribution"} />}
          {maxTransfer&&amount?.gt(maxTransfer)&&<MarkError content={"Amount above user balance"} />}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!enoughContribution || !(collatorAddress || recipientId) || !amount || !!recipientPhish}
          label={t<string>('Delegate')}
          onStart={onClose}
          params={
            [collatorAddress || recipientId,amount,candidateDelegationCount,delegationCount]// TOD: fetch last parameters
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
