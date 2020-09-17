// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveBalancesAll } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputAddress, InputBalance, Modal, Toggle, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function Transfer ({ className = '', onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [hasAvailable] = useState(true);
  const [isProtected, setIsProtected] = useState(true);
  const [isAll, setIsAll] = useState(false);
  const [maxTransfer, setMaxTransfer] = useState<BN | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [senderId]);

  useEffect((): void => {
    if (balances && balances.accountId.eq(senderId) && recipientId && senderId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.balances
            .transfer(recipientId, balances.availableBalance)
            .paymentInfo(senderId)
            .then(({ partialFee }): void => {
              const maxTransfer = balances.availableBalance.sub(partialFee);

              setMaxTransfer(
                maxTransfer.gt(api.consts.balances.existentialDeposit)
                  ? maxTransfer
                  : null
              );
            })
            .catch(console.error);
        } catch (error) {
          console.error((error as Error).message);
        }
      }, 0);
    } else {
      setMaxTransfer(null);
    }
  }, [api, balances, recipientId, senderId]);

  const transferrable = <span className='label'>{t<string>('transferrable')}</span>;
  const canToggleAll = !isProtected && balances && balances.accountId.eq(senderId) && maxTransfer;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Send funds')}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns>
            <Modal.Column>
              <InputAddress
                defaultValue={propSenderId}
                help={t<string>('The account you will send funds from.')}
                isDisabled={!!propSenderId}
                label={t<string>('send from account')}
                labelExtra={
                  <Available
                    label={transferrable}
                    params={senderId}
                  />
                }
                onChange={setSenderId}
                type='account'
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The transferred balance will be subtracted (along with fees) from the sender account.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
              <InputAddress
                defaultValue={propRecipientId}
                help={t<string>('Select a contact or paste the address you want to send funds to.')}
                isDisabled={!!propRecipientId}
                label={t<string>('send to address')}
                labelExtra={
                  <Available
                    label={transferrable}
                    params={recipientId}
                  />
                }
                onChange={setRecipientId}
                type='allPlus'
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}</p>
            </Modal.Column>
          </Modal.Columns>
          <Modal.Columns>
            <Modal.Column>
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
              {api.tx.balances.transferKeepAlive && (
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
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.')}</p>
              <p>{t('With the keep-alive option set, the account is protected against removal due to low balances.')}</p>
            </Modal.Column>
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='paper-plane'
          isDisabled={!hasAvailable || !recipientId || !amount}
          label={t<string>('Make Transfer')}
          onStart={onClose}
          params={
            canToggleAll && isAll
              ? [recipientId, maxTransfer]
              : [recipientId, amount]
          }
          tx={
            isProtected && api.tx.balances.transferKeepAlive
              ? 'balances.transferKeepAlive'
              : 'balances.transfer'
          }
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
