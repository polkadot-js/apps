// Copyright 2017-2020 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, {useState, useEffect} from 'react';
import {useApi, useOwnStashes} from '@polkadot/react-hooks/index';
import {Button, InputBalance, TxButton} from '@polkadot/react-components';
import {useTranslation} from '@polkadot/app-accounts/translate';
import { Balance } from '@polkadot/types/interfaces/runtime';
import Summary from './summary';
import { useBalanceClear, useFees, WholeFeesType } from "@polkadot/app-staking/Nomination/useBalance";
import { formatBalance } from '@polkadot/util';

interface Props {
  transfer?: boolean | false;
  recipientId?: string | null;
  senderId?: string | null;
  stepsState: string[];
  setStepsState: (stepsState: string[]) => void;
  validators: string[];
}

function BondOrTransfer ({ recipientId, senderId, transfer, stepsState, setStepsState, validators }: Props): React.ReactElement<Props> {
  const [amount, setAmount] = useState<BN | undefined | null>(null);
  const [transferableAmount, setTransferableAmount] = useState<BN>(new BN(1));
  const [amountToBond, setAmountToBond] = useState<BN>(new BN(1));
  const accountBalance: Balance | null = useBalanceClear(senderId);
  const controllerBalance: Balance | null = useBalanceClear(recipientId);
  const { wholeFees, feesLoading } : WholeFeesType = useFees(recipientId, senderId, validators);
  const { t } = useTranslation();
  const { api } = useApi();
  const destination = 2; // 2 means controller account
  const extrinsic = (amount && recipientId)
    ? api.tx.staking.bond(recipientId, amount, destination)
    : null;
  // bond more funds
  // api.tx.staking.bondExtra(maxAdditional)
  const canSubmit = true;
  const existentialDeposit = api.consts.balances.existentialDeposit;

  function isBalanceEnough() {
    return (accountBalance
      && controllerBalance
      && existentialDeposit
      && wholeFees
      && accountBalance.cmp(existentialDeposit) === 1
      && controllerBalance.cmp(wholeFees) === 1)
  }

  function calculateMaxPreFilledBalance() {
    if (accountBalance && wholeFees) {
      // double wholeFees
      setAmountToBond(accountBalance.isub(wholeFees).isub(wholeFees).isub(existentialDeposit));
    }
    return 0;
  }

  function setStepsStateAction() {
    if (transfer) {
      const newStepsState = [...stepsState];
      if (isBalanceEnough()) {
        newStepsState[2] = 'completed';
        newStepsState[3] = newStepsState[3] === 'disabled' ? '' : newStepsState[3];
      } else {
        newStepsState[2] = '';
      }
      setStepsState(newStepsState);
    } else {
      const newStepsState = [...stepsState];
      newStepsState[3] = 'completed';
      newStepsState[4] = '';
      setStepsState(newStepsState);
    }
  }

  function setAmountToTransfer() {
    const minAmount = new BN(0);
    setTransferableAmount(
      minAmount
        .iadd(wholeFees)
        .iadd(wholeFees)
        .isub(controllerBalance || new BN(0))
    );
  }

  useEffect(() => {
    setStepsStateAction();
    if (!wholeFees) {
      return;
    }
    if (transfer) {
      setAmountToTransfer();
    } else {
      calculateMaxPreFilledBalance();
    }
  },[accountBalance, controllerBalance, wholeFees]);

  if (transfer) {
    if (feesLoading) {
      return <div />;
    }
    return (
      <section>
        {!isBalanceEnough() && (
          <>
            <h1>Transfer</h1>
            <div className='ui--row'>
              <div className='large'>
                <InputBalance
                  value={formatBalance(transferableAmount, { withUnit: false })}
                  label={`amount to ${transfer ? 'transfer' : 'bond'}`}
                  onChange={setAmount}
                />
                <Button.Group>
                  <TxButton
                    isDisabled={!wholeFees}
                    accountId={senderId}
                    icon='send'
                    label='Transfer'
                    params={[recipientId, amount]}
                    tx='balances.transfer'
                    withSpinner
                  />
                </Button.Group>
              </div>
              <Summary className='small'>Transfer to controller account.
                Transfer fees and per-transaction fees apply and will be calculated upon submission.</Summary>
            </div>
          </>
        )}
        {isBalanceEnough() && (
          <h1>You have enough balance to bond!</h1>
        )}
      </section>
    )
  }

  return (
    <section>
      <h1>Bond</h1>
      <div className='ui--row'>
        <div className='large'>
          {/* The amount field will be pre-populated with maximum possible amount */}
          <InputBalance
            value={formatBalance(amountToBond).split(' ')[0]}
            label={`amount to ${transfer ? 'transfer' : 'bond'}`}
            onChange={setAmount}
          />
          <Button.Group>
            <TxButton
              accountId={senderId}
              isDisabled={!canSubmit}
              isPrimary
              label={t('Bond')}
              icon='sign-in'
              extrinsic={extrinsic}
            />
          </Button.Group>
        </div>
        <Summary className='small'>Bond to controller account.
          Bond fees and per-transaction fees apply and will be calculated upon submission.</Summary>
      </div>
    </section>
  );
}

export default React.memo(BondOrTransfer);
