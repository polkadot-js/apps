// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';
import type { AmountValidateState, DestinationType } from '../types';
import type { BondInfo } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, InputAddress, InputBalance, MarkError, Modal, Static } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceFree, BlockToTime } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import InputValidateAmount from '../Account/InputValidateAmount';
import InputValidationController from '../Account/InputValidationController';
import { createDestCurr } from '../destOptions';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  className?: string;
  isNominating?: boolean;
  minNominated?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  onChange: (info: BondInfo) => void;
}

const EMPTY_INFO = {
  bondOwnTx: null,
  bondTx: null,
  controllerId: null,
  controllerTx: null,
  stashId: null
};

function Bond ({ className = '', isNominating, minNominated, minNominatorBond, minValidatorBond, onChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState<BN | undefined>();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [controllerError, setControllerError] = useState<boolean>(false);
  const [controllerId, setControllerId] = useState<string | null>(null);
  const [destination, setDestination] = useState<DestinationType>('Staked');
  const [destAccount, setDestAccount] = useState<string | null>(null);
  const [stashId, setStashId] = useState<string | null>(null);
  const [startBalance, setStartBalance] = useState<BN | null>(null);
  const stashBalance = useCall<DeriveBalancesAll>(api.derive.balances?.all, [stashId]);
  const destBalance = useCall<DeriveBalancesAll>(api.derive.balances?.all, [destAccount]);
  const bondedBlocks = useUnbondDuration();

  const options = useMemo(
    () => createDestCurr(t),
    [t]
  );

  const _setError = useCallback(
    (_: string | null, isFatal: boolean) => setControllerError(isFatal),
    []
  );

  useEffect((): void => {
    stashBalance && setStartBalance(
      stashBalance.freeBalance.gt(api.consts.balances.existentialDeposit)
        ? stashBalance.freeBalance.sub(api.consts.balances.existentialDeposit)
        : BN_ZERO
    );
  }, [api, stashBalance]);

  useEffect((): void => {
    setStartBalance(null);
  }, [stashId]);

  useEffect((): void => {
    const bondDest = destination === 'Account'
      ? { Account: destAccount }
      : destination;

    onChange(
      (amount && amount.gtn(0) && !amountError?.error && !controllerError && controllerId && stashId)
        ? {
          bondOwnTx: api.tx.staking.bond(stashId, amount, bondDest),
          bondTx: api.tx.staking.bond(controllerId, amount, bondDest),
          controllerId,
          controllerTx: api.tx.staking.setController(controllerId),
          stashId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, controllerError, controllerId, destination, destAccount, stashId, onChange]);

  const hasValue = !!amount?.gtn(0);
  const isAccount = destination === 'Account';
  const isDestError = isAccount && destBalance && destBalance.accountId.eq(destAccount) && destBalance.freeBalance.isZero();

  return (
    <div className={className}>
      <Modal.Columns
        hint={
          <>
            <p>{t<string>('Think of the stash as your cold wallet and the controller as your hot wallet. Funding operations are controlled by the stash, any other non-funding actions by the controller itself.')}</p>
            <p>{t<string>('To ensure optimal fund security using the same stash/controller is strongly discouraged, but not forbidden.')}</p>
          </>
        }
      >
        <InputAddress
          label={t<string>('stash account')}
          onChange={setStashId}
          type='account'
          value={stashId}
        />
        <InputAddress
          help={t<string>('The controller is the account that will be used to control any nominating or validating actions. Should not match another stash or controller.')}
          label={t<string>('controller account')}
          onChange={setControllerId}
          type='account'
          value={controllerId}
        />
        <InputValidationController
          accountId={stashId}
          controllerId={controllerId}
          onError={_setError}
        />
      </Modal.Columns>
      {startBalance && (
        <Modal.Columns
          hint={
            <>
              <p>{t<string>('The amount placed at-stake should not be your full available available amount to allow for transaction fees.')}</p>
              <p>{t<string>('Once bonded, it will need to be unlocked/withdrawn and will be locked for at least the bonding duration.')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            defaultValue={startBalance}
            help={t<string>('The total amount of the stash balance that will be at stake in any forthcoming rounds (should be less than the free amount available)')}
            isError={!hasValue || !!amountError?.error}
            label={t<string>('value bonded')}
            labelExtra={
              <BalanceFree
                label={<span className='label'>{t<string>('balance')}</span>}
                params={stashId}
              />
            }
            onChange={setAmount}
          />
          <InputValidateAmount
            controllerId={controllerId}
            isNominating={isNominating}
            minNominated={minNominated}
            minNominatorBond={minNominatorBond}
            minValidatorBond={minValidatorBond}
            onError={setAmountError}
            stashId={stashId}
            value={amount}
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              help={t<string>('The bonding duration for any staked funds. Needs to be unlocked and withdrawn to become available.')}
              label={t<string>('on-chain bonding duration')}
            >
              <BlockToTime value={bondedBlocks} />
            </Static>
          )}
        </Modal.Columns>
      )}
      <Modal.Columns hint={t<string>('Rewards (once paid) can be deposited to either the stash or controller, with different effects.')}>
        <Dropdown
          defaultValue={0}
          help={t<string>('The destination account for any payments as either a nominator or validator')}
          label={t<string>('payment destination')}
          onChange={setDestination}
          options={options}
          value={destination}
        />
        {isAccount && (
          <InputAddress
            help={t('An account that is to receive the rewards')}
            label={t('the payment account')}
            onChange={setDestAccount}
            type='account'
            value={destAccount}
          />
        )}
        {isDestError && (
          <MarkError content={t<string>('The selected destination account does not exist and cannot be used to receive rewards')} />
        )}
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Bond);
