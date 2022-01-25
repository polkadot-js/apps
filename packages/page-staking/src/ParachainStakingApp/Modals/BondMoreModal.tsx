// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
  collatorAddress?: Uint8Array;
}

function BondMoreModal ({ className = '', collatorAddress, onClose, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [[maxTransfer], setMaxTransfer] = useState<[BN | null]>([null]);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = collatorAddress;

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
  }, [api, balances, collatorAddress, propSenderId, senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Bond More')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>('The delegated amount will be subtracted (along with fees) from the sender account.')}>
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will bond more from.')}
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
          <Modal.Columns hint={t<string>('Collator Address')}>
            <InputAddress
              defaultValue={collatorAddress}
              help={t<string>('The collator address')}
              isDisabled={!!collatorAddress}
              label={t<string>('delegate to collator address')}
              type='account'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t<string>('Increase your delegation by this amount.')}>
            {
              <InputBalance
                autoFocus
                help={<>{t<string>('The amount to increase the delegation')}</>}
                isZeroable
                label={t<string>('amount')}
                maxValue={maxTransfer}
                onChange={setAmount}
              />
            }
          </Modal.Columns>

          {maxTransfer && amount?.gt(maxTransfer) && <MarkError content={'Amount above user balance'} />}
        </div>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={propSenderId || senderId}
          icon='paper-plane'
          isDisabled={!(collatorAddress) || !amount || !!recipientPhish}
          label={t<string>('Bond More')}
          onStart={onClose}
          params={
            [collatorAddress, amount]
          }
          tx={
            api.tx.parachainStaking.delegatorBondMore
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(BondMoreModal)`
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
