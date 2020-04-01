// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState } from 'react';
import {useApi} from '@polkadot/react-hooks/index';
import {AddressInfo, Button, InputAddress, InputBalance, TxButton} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import Summary from './summary';

interface Props {
  transfer?: boolean | false;
  recipientId?: string | null;
  senderId?: string | null;
  setSenderId: React.Dispatch<React.SetStateAction<string | null>>;
}

function BondOrTransfer ({ recipientId, senderId, setSenderId, transfer }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);

  const { t } = useTranslation();
  const { api } = useApi();
  const destination = 2; // 2 means controller account
  const extrinsic = (amount && recipientId)
    ? api.tx.staking.bond(recipientId, amount, destination)
    : null;
  const canSubmit = true;
  return (
    <section>
      <h1>{ transfer ? 'Transfer' : 'Bond'}</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputAddress
            label='Sender address'
            onChange={setSenderId}
            type='all'
          />
          <InputBalance
            label='amount to bond'
            onChange={setAmount}
          />
          <Button.Group>
            {transfer && (
              <TxButton
                accountId={senderId}
                icon='send'
                label='Transfer'
                params={[recipientId, amount]}
                tx='balances.transfer'
                withSpinner
              />
            )}
            {!transfer && (
           <TxButton
              accountId={senderId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond')}
              icon='sign-in'
              extrinsic={extrinsic}
            />
            )}
          </Button.Group>
          <AddressInfo
            address={senderId}
            withBalance={{
              available: false,
              bonded: true,
              free: false,
              redeemable: true,
              unlocking: true
            }}
            withRewardDestination
          />
        </div>
        <Summary className='small'>Make a transfer from any account you control to controller account.
          Transfer fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
  );
}

export default React.memo(BondOrTransfer);
