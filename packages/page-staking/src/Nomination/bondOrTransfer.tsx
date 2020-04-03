// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useState, useEffect } from 'react';
import {useApi} from '@polkadot/react-hooks/index';
import {Button, InputBalance, TxButton} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import { Balance } from '@polkadot/types/interfaces/runtime';
import Summary from './summary';
import { useBalanceClear, useFees } from "@polkadot/app-staking/Nomination/useBalance";
import { formatBalance } from '@polkadot/util';

interface Props {
  transfer?: boolean | false;
  recipientId?: string | null;
  senderId?: string | null;
  stepsState: string[];
  setStepsState: (stepsState: string[]) => void;
}

function BondOrTransfer ({ recipientId, senderId, transfer, stepsState, setStepsState }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const accountBalance: Balance | null = useBalanceClear(senderId);
  const controllerBalance: Balance | null = useBalanceClear(recipientId);
  let wholeFees: any | null = useFees(recipientId, senderId);
  const { t } = useTranslation();
  const { api } = useApi();
  const destination = 2; // 2 means controller account
  const extrinsic = (amount && recipientId)
    ? api.tx.staking.bond(recipientId, amount, destination)
    : null;
  const canSubmit = true;
  const existentialDeposit = api.consts.balances.existentialDeposit;

  useEffect(() => {
    if (transfer) {
      const newStepsState = [...stepsState];
      if (accountBalance
        && controllerBalance
        && existentialDeposit
        && wholeFees
        && accountBalance.cmp(existentialDeposit) === 1
        && controllerBalance.cmp(wholeFees) === 1) {
        newStepsState[2] = 'completed';
        newStepsState[3] = newStepsState[3] === 'disabled' ? '' : newStepsState[3];
      } else {
        newStepsState[2] = '';
      }
    } else {
      const newStepsState = [...stepsState];
      newStepsState[3] = 'completed';
      newStepsState[4] = '';
      setStepsState(newStepsState);
    }
  },[accountBalance, controllerBalance, wholeFees]);

  return (
    <section>
      <h1>{ transfer ? 'Transfer' : 'Bond'}</h1>
      <div className='ui--row'>
        <div className='large'>
          <InputBalance
            value={formatBalance(wholeFees).split(' ')[0]}
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
