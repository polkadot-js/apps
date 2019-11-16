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

export default function Transfer ({ accountId }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const [recipientId, setRecipientId] = useState<string | null>(null);

  return (
    <section>
      <h1>transfer</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputAddress
            label='recipient address for this transfer'
            onChange={setRecipientId}
            type='all'
          />
          <InputBalance
            label='amount to transfer'
            onChange={setAmount}
          />
          <Button.Group>
            <TxButton
              accountId={accountId}
              icon='send'
              label='make transfer'
              params={[recipientId, amount]}
              tx='balances.transfer'
            />
          </Button.Group>
        </div>
        <Summary className='small'>Make a transfer from any account you control to another account. Transfer fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
  );
}
