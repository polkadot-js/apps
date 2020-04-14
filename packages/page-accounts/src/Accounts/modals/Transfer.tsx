// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import styled from 'styled-components';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { Available } from '@polkadot/react-query';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  onClose: () => void;
  recipientId?: string;
  senderId?: string;
}

function Transfer ({ className, onClose, recipientId: propRecipientId, senderId: propSenderId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<BN | undefined>(new BN(0));
  const [hasAvailable] = useState(true);
  const [maxBalance] = useState(new BN(0));
  const [recipientId, setRecipientId] = useState<string | null>(propRecipientId || null);
  const [senderId, setSenderId] = useState<string | null>(propSenderId || null);

  const transferrable = <span className='label'>{t('transferrable')}</span>;

  return (
    <Modal
      className='app--accounts-Modal'
      header={t('Send funds')}
    >
      <Modal.Content>
        <div className={className}>
          <InputAddress
            defaultValue={propSenderId}
            help={t('The account you will send funds from.')}
            isDisabled={!!propSenderId}
            label={t('send from account')}
            labelExtra={
              <Available
                label={transferrable}
                params={senderId}
              />
            }
            onChange={setSenderId}
            type='account'
          />
          <InputAddress
            defaultValue={propRecipientId}
            help={t('Select a contact or paste the address you want to send funds to.')}
            isDisabled={!!propRecipientId}
            label={t('send to address')}
            labelExtra={
              <Available
                label={transferrable}
                params={recipientId}
              />
            }
            onChange={setRecipientId}
            type='allPlus'
          />
          <InputBalance
            autoFocus
            help={t('Type the amount you want to transfer. Note that you can select the unit on the right e.g sending 1 milli is equivalent to sending 0.001.')}
            isError={!hasAvailable}
            isZeroable
            label={t('amount')}
            maxValue={maxBalance}
            onChange={setAmount}
            withMax
          />
        </div>
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={senderId}
          icon='send'
          isDisabled={!hasAvailable || !recipientId || !amount}
          isPrimary
          label={t('Make Transfer')}
          onStart={onClose}
          params={[recipientId, amount]}
          tx='balances.transfer'
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
`);
