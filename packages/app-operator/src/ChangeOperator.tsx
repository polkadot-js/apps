// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import { Button, InputAddress, InputBalance, TxButton } from '@polkadot/react-components';

import Summary from './Summary';

interface Props {
  accountId?: string | null;
}

export default function ChangeOperator ({ accountId }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  return (
    <section>
      <h1>change operator</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputAddress
            defaultValue={propSenderId}//TODO
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


          <InputAddress
            label='recipient address for this change operator'
            onChange={setRecipientId}
            type='all'
          />
          <InputBalance
            label='amount to change operator'
            onChange={setAmount}
          />
          <Button.Group>
            <TxButton
              accountId={accountId}
              icon='send'
              label='make change operator'
              params={[recipientId, amount]}
              tx='operator.changeOperator'
            />
          </Button.Group>
        </div>
        <Summary className='small'>Make a change operator from any account you control to another account. ChangeOperator fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
  );
}
