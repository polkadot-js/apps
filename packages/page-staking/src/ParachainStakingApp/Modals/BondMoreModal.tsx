// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';

import { InputAddress, InputBalance, MarkError, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Available } from '@polkadot/react-query';
import { BN, BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  delegatorAddress: string | null;
  candidateAddress?: string;
}

function BondMoreModal ({ candidateAddress, className = '', delegatorAddress, onClose }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [selectedDelegator, setSelectedDelegator] = useState<string | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>(BN_ZERO);
  const [maxTransfer, setMaxTransfer] = useState<BN | null>(null);

  const delegator = delegatorAddress || selectedDelegator;
  const candidate = candidateAddress || selectedCandidate;

  const balances = useCall<DeriveBalancesAll>(api.derive.balances?.all, [delegator]);

  // Calculate max amount taking into account tx fee and balance
  useEffect((): void => {
    if (
      balances &&
      balances.accountId?.eq(delegator) &&
      delegator &&
      candidate &&
      isFunction(api.rpc.payment?.queryInfo)
    ) {
      try {
        api.tx.parachainStaking.delegatorBondMore(candidate, balances.availableBalance)
          .paymentInfo(delegator)
          .then(({ partialFee }): void => {
            const adjFee = partialFee.muln(110).div(BN_HUNDRED);

            setMaxTransfer(
              BN.max(
                balances.availableBalance.sub(adjFee),
                new BN(1)
              )
            );
          })
          .catch(console.error);
      } catch (error) {
        console.error((error as Error).message);
      }
    } else {
      setMaxTransfer(null);
    }
  }, [api, balances, candidate, delegator]);

  return (
    <Modal
      className='app--accounts-Modal'
      header={t<string>('Bond More')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <div className={className}>
          <Modal.Columns hint={t<string>('The delegated amount will be subtracted (along with fees) from the delegator account.')}>
            <InputAddress
              defaultValue={delegatorAddress}
              help={t<string>('The account that has an active delegation on the collator candidate.')}
              isDisabled={!!delegatorAddress}
              label={t<string>('delegator account')}
              labelExtra={
                <Available
                  label={t<string>('transferrable')}
                  params={delegator}
                />
              }
              onChange={setSelectedDelegator}
              type='account'
            />
          </Modal.Columns>
          <Modal.Columns>
            <InputAddress
              defaultValue={candidateAddress}
              help={t<string>('Delegated collator candidate')}
              isDisabled={!!candidateAddress}
              label={t<string>('collator candidate')}
              onChange={setSelectedCandidate}
              type='allPlus'
            />
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
          accountId={delegator}
          icon='paper-plane'
          isDisabled={
            !candidate ||
            !amount ||
            !maxTransfer ||
            amount.gt(maxTransfer)
          }
          label={t<string>('Bond More')}
          onStart={onClose}
          params={
            [candidate, amount]
          }
          tx={
            api.tx.parachainStaking.delegatorBondMore
          }
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondMoreModal);
