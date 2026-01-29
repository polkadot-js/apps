// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { AccountInfoWithProviders, AccountInfoWithRefCount } from '@polkadot/types/interfaces';
import type { KeyringJson$Meta } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { checkAddress } from '@polkadot/phishing';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { settings } from '@polkadot/ui-settings';
import { BN_HUNDRED, BN_ZERO, isFunction, nextTick } from '@polkadot/util';

import InputAddress from '../InputAddress/index.js';
import InputBalance from '../InputBalance.js';
import MarkError from '../MarkError.js';
import MarkWarning from '../MarkWarning.js';
import Modal from '../Modal/index.js';
import { styled } from '../styled.js';
import Toggle from '../Toggle.js';
import { useTranslation } from '../translate.js';
import TxButton from '../TxButton.js';
import { getAddressMeta } from '../util/getAddressMeta.js';

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
  const [senderIdMeta, setSenderIdMeta] = useState<KeyringJson$Meta>();
  const [[maxTransfer, noFees], setMaxTransfer] = useState<[BN | null, boolean]>([null, false]);
  const [recipientId, setRecipientId] = useState<string | null>(null);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);
  const accountInfo = useCall<AccountInfoWithProviders | AccountInfoWithRefCount>(api.query.system.account, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId;
    const toId = propRecipientId || recipientId;

    fromId && setSenderIdMeta(getAddressMeta(fromId));

    if (balances && balances.accountId?.eq(fromId) && fromId && toId && api.call.transactionPaymentApi && api.tx.balances) {
      nextTick(async (): Promise<void> => {
        try {
          const extrinsic = (api.tx.balances.transferAllowDeath || api.tx.balances.transfer)(toId, (balances.transferable || balances.availableBalance));
          const { partialFee } = await extrinsic.paymentInfo(fromId);
          const adjFee = partialFee.muln(110).div(BN_HUNDRED);
          const maxTransfer = (balances.transferable || balances.availableBalance).sub(adjFee);

          setMaxTransfer(
            api.consts.balances && maxTransfer.gt(api.consts.balances.existentialDeposit)
              ? [maxTransfer, false]
              : [null, true]
          );
        } catch (error) {
          console.error(error);
        }
      });
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
  const canToggleAll = !isProtected && balances && balances.accountId?.eq(propSenderId || senderId) && maxTransfer && noReference;

  return (
    <StyledModal
      className='app--accounts-Modal'
      header={t('Send funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t('The transferred balance will be subtracted (along with fees) from the sender account.')}>
            <InputAddress
              defaultValue={propSenderId}
              isDisabled={!!propSenderId}
              label={t('send from account')}
              labelExtra={
                <Available
                  label={t('transferable')}
                  params={propSenderId || senderId}
                />
              }
              onChange={setSenderId}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns hint={t('The beneficiary will have access to the transferred fees when the transaction is included in a block.')}>
            <InputAddress
              defaultValue={propRecipientId}
              isDisabled={!!propRecipientId}
              label={t('send to address')}
              labelExtra={
                <Available
                  label={t('transferable')}
                  params={propRecipientId || recipientId}
                />
              }
              onChange={setRecipientId}
              type='allPlus'
            />
            {recipientPhish && (
              <MarkError content={t('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t('If the recipient account is new, the balance needs to be more than the existential deposit. Likewise if the sending account balance drops below the same value, the account will be removed from the state.')}>
            {canToggleAll && isAll
              ? (
                <InputBalance
                  autoFocus
                  defaultValue={maxTransfer}
                  isDisabled
                  key={maxTransfer?.toString()}
                  label={t('transferable minus fees')}
                />
              )
              : (
                <>
                  <InputBalance
                    autoFocus
                    isError={!hasAvailable}
                    isZeroable
                    label={t('amount')}
                    maxValue={maxTransfer}
                    onChange={setAmount}
                  />
                  <InputBalance
                    defaultValue={api.consts.balances?.existentialDeposit}
                    isDisabled
                    label={t('existential deposit')}
                  />
                </>
              )
            }
          </Modal.Columns>
          <Modal.Columns hint={t('With the keep-alive option set, the account is protected against removal due to low balances.')}>
            {isFunction(api.tx.balances?.transferKeepAlive) && (
              <Toggle
                className='typeToggle'
                label={
                  isProtected
                    ? t('Transfer with account keep-alive checks')
                    : t('Normal transfer without keep-alive checks')
                }
                onChange={setIsProtected}
                value={isProtected}
              />
            )}
            {canToggleAll && (
              <Toggle
                className='typeToggle'
                label={t('Transfer the full account balance, reap the sender')}
                onChange={setIsAll}
                value={isAll}
              />
            )}
            {senderIdMeta && senderIdMeta.isHardware && (
              <MarkWarning content={t(`You are using the Ledger ${settings.ledgerApp.toUpperCase()} App. If you would like to switch it, please go the "manage ledger app" in the settings.`)} />
            )}
            {!isProtected && !noReference && (
              <MarkWarning content={t('There is an existing reference count on the sender account. As such the account cannot be reaped from the state.')} />
            )}
            {noFees && (
              <MarkWarning content={t('The transaction, after application of the transfer fees, will drop the available balance below the existential deposit. As such the transfer will fail. The account needs more free funds to cover the transaction fees.')} />
            )}
          </Modal.Columns>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={
            (!isAll && (!hasAvailable || !amount)) ||
            !(propRecipientId || recipientId) ||
            !!recipientPhish
          }
          label={t('Make Transfer')}
          onStart={onClose}
          params={
            canToggleAll && isAll
              ? isFunction(api.tx.balances?.transferAll)
                ? [propRecipientId || recipientId, false]
                : [propRecipientId || recipientId, maxTransfer]
              : [propRecipientId || recipientId, amount]
          }
          tx={
            canToggleAll && isAll && isFunction(api.tx.balances?.transferAll)
              ? api.tx.balances?.transferAll
              : isProtected
                ? api.tx.balances?.transferKeepAlive
                : api.tx.balances?.transferAllowDeath || api.tx.balances?.transfer
          }
        />
      </Modal.Actions>
    </StyledModal>
  );
}

const StyledModal = styled(Modal)`
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
`;

export default React.memo(Transfer);
