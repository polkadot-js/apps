// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import {useApi} from '@polkadot/react-hooks/index';
import {Button, InputBalance, TxButton} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import { formatBalance } from '@polkadot/util';
import Summary from './summary';
import useBalance from "@polkadot/app-staking/Nomination/useBalance";

interface Props {
  transfer?: boolean | false;
  recipientId?: string | null;
  senderId?: string | null;
  stepsState: string[];
  setStepsState: (stepsState: string[]) => void;
}

function BondOrTransfer ({ recipientId, senderId, transfer, stepsState, setStepsState }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const accountBalance = useBalance(senderId);
  const controllerBalance = useBalance(recipientId);
  const { t } = useTranslation();
  const { api } = useApi();
  const destination = 2; // 2 means controller account
  const extrinsic = (amount && recipientId)
    ? api.tx.staking.bond(recipientId, amount, destination)
    : null;
  const canSubmit = true;

  function getFees(bondedAddress: string, senderAddress: string) {
    const si = formatBalance.findSi('-');
    const TEN = new BN(10);
    const basePower = formatBalance.getDefaults().decimals;
    const siPower = new BN(basePower + si.power);
    const amount = new BN(1000).mul(TEN.pow(siPower));
    api.tx.staking.bond(bondedAddress, amount, 2)
      .paymentInfo(senderAddress).then(bondPaimentInfo => {
      console.log('bondPaymentInfo', formatBalance(bondPaimentInfo.partialFee));
    });
    api.tx.balances.transfer(bondedAddress, amount)
      .paymentInfo(senderAddress).then(paymentInfo => {
      console.log('paymentInfo', formatBalance(paymentInfo.partialFee));
    });
  }

  useEffect(() => {
    const newStepsState = [...stepsState];
    if (accountBalance && accountBalance.length > 1 && controllerBalance && controllerBalance.length > 1) {
      newStepsState[2] = 'completed';
      newStepsState[3] = newStepsState[3] === 'disabled' ? '' : newStepsState[3];
    } else {
      newStepsState[2] = '';
    }
    setStepsState(newStepsState);
    console.log('newStepsState', newStepsState);
    console.log('accountBalance', accountBalance);
    console.log('controllerBalance', controllerBalance);
  },[accountBalance, controllerBalance]);

  useEffect(() => {
    if (senderId && recipientId) {
      getFees(recipientId, senderId);
    }
  }, []);

  return (
    <section>
      <h1>{ transfer ? 'Transfer' : 'Bond'}</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputBalance
            label={`amount to ${transfer ? 'transfer' : 'bond'}`}
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
        </div>
        <Summary className='small'>Make a transfer from any account you control to controller account.
          Transfer fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
  );
}

export default React.memo(BondOrTransfer);
