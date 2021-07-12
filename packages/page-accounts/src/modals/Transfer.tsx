// Copyright 2017-2021 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { checkAddress } from '@polkadot/phishing';
import { InputAddress, InputBalance, MarkError, MarkWarning, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function isRefcount (accountInfo: AccountInfoWithProviders | AccountInfoWithRefCount): accountInfo is AccountInfoWithRefCount {
  return !!(accountInfo as AccountInfoWithRefCount).refcount;
}

async function checkPhishing (_senderId: string | null, recipientId: string | null): Promise<[string | null, string | null]> {
  return [
    // not being checked atm
    // senderId
    //   ? await checkAddress(senderId)
    //   : null,
    null,
    recipientId
      ? await checkAddress(recipientId)
      : null
  ];
}

function Transfer ({ className = '', onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isAll, setIsAll] = useState(false);
  const [[maxTransfer, noFees], setMaxTransfer] = useState<[BN | null, boolean]>([null, false]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(api.query.system.account, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = propRecipientId || recipientId as string;

    if (balances && balances.accountId.eq(fromId) && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.balances
            .transfer(toId, balances.availableBalance)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const maxTransfer = balances.availableBalance.sub(adjFee);

              setMaxTransfer(
                maxTransfer.gt(api.consts.balances.existentialDeposit)
                  ? [maxTransfer, false]
                  : [null, true]
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
  }, [api, balances, propRecipientId, propSenderId, recipientId, senderId]);

  useEffect((): void => {
    checkPhishing(propSenderId || senderId, propRecipientId || recipientId)
      .then(setPhishing)
      .catch(console.error);
  }, [propRecipientId, propSenderId, recipientId, senderId]);

  const noReference = accountInfo
    ? isRefcount(accountInfo)
      ? accountInfo.refcount.isZero()
      : accountInfo.consumers.isZero()
    : true;
  const canToggleAll = !isProtected && balances && balances.accountId.eq(propSenderId || senderId) && maxTransfer && noReference;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send funds')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}>
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will send funds from.')}
              isDisabled={!!propSenderId}
              label={t<string>('send from account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={propSenderId || senderId}
                />
              }
              onChange={setSenderId}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
            <InputAddress
              defaultValue={propRecipientId}
              help={t<string>('Select a contact or paste the address you want to send funds to.')}
              isDisabled={!!propRecipientId}
              label={t<string>('send to address')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={propRecipientId || recipientId}
                />
              }
              onChange={setRecipientId}
              type='allPlus'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t<string>('If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.')}>
            {canToggleAll && isAll
              ? (
                <InputBalance
                  autoFocus
                  defaultValue={maxTransfer}
                  help={t<string>('The full account balance to be transferred, minus the transaction fees')}
                  isDisabled
                  key={maxTransfer?.toString()}
                  label={t<string>('transferrable minus fees')}
                />
              )
              : (
                <>
                  <InputBalance
                    autoFocus
                    help={t<string>('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
                    isError={!hasAvailable}
                    isZeroable
                    label={t<string>('amount')}
                    onChange={setAmount}
                  />
                  <InputBalance
                    defaultValue={api.consts.balances.existentialDeposit}
                    help={t<string>('The minimum amount that an account should have to be deemed active')}
                    isDisabled
                    label={t<string>('existential deposit')}
                  />
                </>
              )
            }
          </Modal.Columns>
          <Modal.Columns hint={t('With the keep-alive option set, the account is protected against removal due to low balances.')}>
            {isFunction(api.tx.balances.transferKeepAlive) && (
              <Toggle
                className='typeToggle'
                label={
                  isProtected
                    ? t<string>('Transfer with account keep-alive checks')
                    : t<string>('Normal transfer without keep-alive checks')
                }
                onChange={setIsProtected}
                value={isProtected}
              />
            )}
            {canToggleAll && (
              <Toggle
                className='typeToggle'
                label={t<string>('Transfer the full account balance, reap the sender')}
                onChange={setIsAll}
                value={isAll}
              />
            )}
            {!isProtected && !noReference && (
              <MarkWarning content={t<string>('There is an existing reference count on the sender account. As such the account cannot be reaped from the state.')} />
            )}
            {noFees && (
              <MarkWarning content={t<string>('The transaction, after application of the transfer fees, will drop the available balance below the existential deposit. As such the transfer will fail. The account needs more free funds to cover the transaction fees.')} />
            )}
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !(propRecipientId || recipientId) || !amount || !!recipientPhish}
          label={t<string>('Make Transfer')}
          onStart={onClose}
          params={
            canToggleAll && isAll
              ? [propRecipientId || recipientId, maxTransfer]
              : [propRecipientId || recipientId, amount]
          }
          tx={(isProtected && api.tx.balances.transferKeepAlive) || api.tx.balances.transfer}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(Transfer)`
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
