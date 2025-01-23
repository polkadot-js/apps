// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';
import type { AmountValidateState, DestinationType } from '../types.js';
import type { BondInfo } from './types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Dropdown, InputAddress, InputBalance, MarkError, Modal, Static } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceFree, BlockToTime } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate.js';
import InputValidateAmount from '../Account/InputValidateAmount.js';
import InputValidationController from '../Account/InputValidationController.js';
import { createDestCurr } from '../destOptions.js';
import useUnbondDuration from '../useUnbondDuration.js';

interface Props {
  className?: string;
  isNominating?: boolean;
  minNominated?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  onChange: (info: BondInfo) => void;
}

const EMPTY_INFO: BondInfo = {
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

  const needsController = useMemo(
    () => api.tx.staking.bond.meta.args.length === 3,
    [api]
  );

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
    const [mapControllerId, mapControllerError] = needsController
      ? [controllerId, controllerError]
      : [stashId, null];

    onChange(
      (amount && amount.gtn(0) && !amountError?.error && !mapControllerError && mapControllerId && stashId)
        ? {
          bondTx: needsController
            // The bond always goes through first, if a controller is used
            // we have a batch with setController at the end
            // @ts-expect-error Previous generation
            ? api.tx.staking.bond(stashId, amount, bondDest)
            : api.tx.staking.bond(amount, bondDest),
          controllerId: mapControllerId,
          controllerTx: needsController
            // @ts-expect-error Previous generation
            ? api.tx.staking.setController(mapControllerId)
            : null,
          stashId
        }
        : EMPTY_INFO
    );
  }, [api, amount, amountError, controllerError, controllerId, destination, destAccount, needsController, onChange, stashId]);

  const hasValue = !!amount?.gtn(0);
  const isAccount = destination === 'Account';
  const isDestError = isAccount && destBalance && destBalance.accountId.eq(destAccount) && destBalance.freeBalance.isZero();

  return (
    <div className={className}>
      <Modal.Columns
        hint={
          needsController
            ? (
              <>
                <p>{t('Think of the stash as your cold wallet and the controller as your hot wallet. Funding operations are controlled by the stash, any other non-funding actions by the controller itself.')}</p>
                <p>{t('To ensure optimal fund security using the same stash/controller is strongly discouraged, but not forbidden.')}</p>
              </>
            )
            : (
              <>
                <p>{t('The stash should be treated as a cold wallet.')}</p>
                <p>{t('As such it is recommended that you setup a proxy to control operations via the stash.')}</p>
              </>
            )
        }
      >
        <InputAddress
          label={t('stash account')}
          onChange={setStashId}
          type='account'
          value={stashId}
        />
        {needsController && (
          <>
            <InputAddress
              label={t('controller account')}
              onChange={setControllerId}
              type='account'
              value={controllerId}
            />
            <InputValidationController
              accountId={stashId}
              controllerId={controllerId}
              onError={_setError}
            />
          </>
        )}
      </Modal.Columns>
      {startBalance && (
        <Modal.Columns
          hint={
            <>
              <p>{t('The amount placed at-stake should not be your full available amount to allow for transaction fees.')}</p>
              <p>{t('Once bonded, it will need to be unlocked/withdrawn and will be locked for at least the bonding duration.')}</p>
            </>
          }
        >
          <InputBalance
            autoFocus
            defaultValue={startBalance}
            isError={!hasValue || !!amountError?.error}
            label={t('value bonded')}
            labelExtra={
              <BalanceFree
                label={<span className='label'>{t('balance')}</span>}
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
              label={t('on-chain bonding duration')}
            >
              <BlockToTime value={bondedBlocks} />
            </Static>
          )}
        </Modal.Columns>
      )}
      <Modal.Columns hint={t('Rewards (once paid) can be deposited to either the stash or controller, with different effects.')}>
        <Dropdown
          defaultValue={0}
          label={t('payment destination')}
          onChange={setDestination}
          options={options}
          value={destination}
        />
        {isAccount && (
          <InputAddress
            label={t('the payment account')}
            onChange={setDestAccount}
            type='account'
            value={destAccount}
          />
        )}
        {isDestError && (
          <MarkError content={t('The selected destination account does not exist and cannot be used to receive rewards')} />
        )}
      </Modal.Columns>
    </div>
  );
}

export default React.memo(Bond);
