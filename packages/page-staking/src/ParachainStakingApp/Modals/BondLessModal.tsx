// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import { Delegation } from '../types';

interface Props {
  className?: string;
  onClose: () => void;
  senderId?: string;
  delegation: Delegation
  roundDuration: BN
}

function BondLessModal ({ className = '', delegation, onClose, roundDuration, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [[maxTransfer], setMaxTransfer] = useState<[BN | null]>([null]);
  const [senderId, setSenderId] = useState<string | null>(null);
  const [[, recipientPhish], setPhishing] = useState<[string | null, string | null]>([null, null]); // TODO: handle phishing
  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [propSenderId || senderId]);

  useEffect((): void => {
    const fromId = propSenderId || senderId as string;
    const toId = delegation.collatorAddress;

    if (delegation && delegation.delegationAmount && fromId && toId && isFunction(api.rpc.payment?.queryInfo)) {
      setTimeout((): void => {
        try {
          api.tx.parachainStaking.scheduleDelegatorBondLess(delegation.collatorAddress, delegation.delegationAmount)
            .paymentInfo(fromId)
            .then(({ partialFee }): void => {
              const adjFee = partialFee.muln(110).div(BN_HUNDRED);
              const maxTransfer = (new BN(delegation.delegationAmount)).sub(adjFee);

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
  }, [api, balances, delegation, propSenderId, senderId]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Bond less')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>(`The delegating account will get their tokens back after ${Number(api.consts.parachainStaking.leaveDelegatorsDelay)} rounds (${Number(api.consts.parachainStaking.candidateBondLessDelay) * Number(roundDuration)} blocks).`)}>
            <InputAddress
              defaultValue={propSenderId}
              help={t<string>('The account you will decrease the delegation from.')}
              isDisabled={!!propSenderId}
              label={t<string>('delegator account')}
              labelExtra={
                <FormatBalance
                  className={className}
                  label={t<string>('retrievable')}
                  value={delegation.delegationAmount}
                />
              }
              onChange={setSenderId}
              type='allPlus'
            />
          </Modal.Columns>
          <Modal.Columns hint={t<string>('Collator Address')}>
            <InputAddress
              defaultValue={delegation.collatorAddress}
              help={t<string>('Collator Address')}
              isDisabled={!!delegation.collatorAddress}
              label={t<string>('reduce delegation to collator address')}
              type='account'
            />
            {recipientPhish && (
              <MarkError content={t<string>('The recipient is associated with a known phishing site on {{url}}', { replace: { url: recipientPhish } })} />
            )}
          </Modal.Columns>
          <Modal.Columns hint={t<string>('Decrease your delegation by this amount.')}>
            {
              <InputBalance
                autoFocus
                isZeroable
                label={t<string>('amount')}
                labelExtra={
                  <FormatBalance
                    className={className}
                    label={t<string>('max amount with fees')}
                    value={maxTransfer}
                  />
                }
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
          isDisabled={!(delegation.collatorAddress) || !amount || !!recipientPhish}
          label={t<string>('Bond Less')}
          onStart={onClose}
          params={
            [delegation.collatorAddress, amount]
          }
          tx={
            api.tx.parachainStaking.scheduleDelegatorBondLess
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(styled(BondLessModal)`
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
