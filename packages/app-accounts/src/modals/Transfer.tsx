/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { DerivedFees } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';
import Checks from '@polkadot/react-signer/Checks';
import { ApiContext } from '@polkadot/react-api';

import translate from '../translate';

interface Props extends I18nProps {
  balances_fees?: DerivedFees;
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

const ZERO = new BN(0);

// TODO Re-enable when we have proper fee calculation (incl. weights)
// async function calcMax (api: ApiPromise, balances_fees: DerivedFees | undefined, senderId: string, recipientId: string): Promise<BN> {
//   let maxBalance = new BN(1);

//   if (!balances_fees) {
//     return maxBalance;
//   }

//   const { transferFee, transactionBaseFee, transactionByteFee, creationFee } = balances_fees;

//   const [senderNonce, senderBalances, recipientBalances] = await Promise.all([
//     api.query.system.accountNonce<Index>(senderId),
//     api.derive.balances.all(senderId),
//     api.derive.balances.all(recipientId)
//   ]);

//   let prevMax = new BN(0);

//   // something goes screwy here when we move this out of the component :(
//   let extrinsic: any;

//   while (!prevMax.eq(maxBalance)) {
//     prevMax = maxBalance;
//     extrinsic = api.tx.balances.transfer(senderNonce, prevMax);

//     const txLength = calcTxLength(extrinsic, senderNonce);
//     const fees = transactionBaseFee
//       .add(transactionByteFee.mul(txLength))
//       .add(transferFee)
//       .add(recipientBalances.availableBalance.isZero() ? creationFee : ZERO);

//     maxBalance = bnMax(senderBalances.availableBalance.sub(fees), ZERO);
//   }

//   return maxBalance;
// }

function Transfer ({ className, onClose, recipientId: propRecipientId, senderId: propSenderId, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [extrinsic, setExtrinsic] = useState<SubmittableExtrinsic | null>(null);
  const [hasAvailable, setHasAvailable] = useState(true);
  const [maxBalance] = useState(new BN(0));
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);

  useEffect((): void => {
    if (senderId && recipientId) {
      setExtrinsic(api.tx.balances.transfer(recipientId, amount || ZERO));

      // We currently have not enabled the max functionality - we don't take care of weights
      // calcMax(api, balances_fees, senderId, recipientId)
      //   .then(([maxBalance]): void => setMaxBalance(maxBalance))
      //   .catch((error: Error): void => console.error(error));
    }
  }, [amount, recipientId, senderId]);

  const transferrable = <span className='label'>{t('transferrable ')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      dimmer='inverted'
      open
    >
      <Modal.Header>{t('Send funds')}</Modal.Header>
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={propSenderId}
            help={t('The account you will send funds from.')}
            isDisabled={!!propSenderId}
            label={t('send from account')}
            labelExtra={<Available label={transferrable} params={senderId} />}
            onChange={setSenderId}
            type='account'
          />
          <InputAddress
            defaultValue={propRecipientId}
            help={t('Select a contact or paste the address you want to send funds to.')}
            isDisabled={!!propRecipientId}
            label={t('send to address')}
            labelExtra={<Available label={transferrable} params={recipientId} />}
            onChange={setRecipientId}
            type='allPlus'
          />
          <InputBalance
            help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
            isError={!hasAvailable}
            label={t('amount')}
            maxValue={maxBalance}
            onChange={setAmount}
            withMax
          />
          <Checks
            accountId={senderId}
            extrinsic={extrinsic}
            isSendable
            onChange={setHasAvailable}
          />
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button.Group>
          <Button
            icon='cancel'
            isNegative
            label={t('Cancel')}
            onClick={onClose}
          />
          <Button.Or />
          <TxButton
            accountId={senderId}
            extrinsic={extrinsic}
            icon='send'
            isDisabled={!hasAvailable}
            isPrimary
            label={t('Make Transfer')}
            onStart={onClose}
            withSpinner={false}
          />
        </Button.Group>
      </Modal.Actions>
    </Modal>
  );
}

export default translate(
  styled(Transfer)`
    article.padded {
      box-shadow: none;
      margin-left: 2rem;
    }

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
  `
);
