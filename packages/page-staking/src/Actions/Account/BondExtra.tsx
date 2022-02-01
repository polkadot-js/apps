// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import type { AmountValidateState } from '../types';

import React, { useMemo, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}

function calcBalance (api: ApiPromise, stakingInfo?: DeriveStakingAccount, stashBalance?: DeriveBalancesAll): BN | null {
  if (stakingInfo && stakingInfo.stakingLedger && stashBalance) {
    const sumUnlocking = (stakingInfo.unlocking || []).reduce((acc, { value }) => acc.iadd(value), new BN(0));
    const redeemable = stakingInfo.redeemable || BN_ZERO;
    const available = stashBalance.freeBalance.sub(stakingInfo.stakingLedger.active?.unwrap() || BN_ZERO).sub(sumUnlocking).sub(redeemable);

    return available.gt(api.consts.balances.existentialDeposit)
      ? available.sub(api.consts.balances.existentialDeposit)
      : BN_ZERO;
  }

  return null;
}

function BondExtra ({ controllerId, onClose, stakingInfo, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();
  const stashBalance = useCall<DeriveBalancesAll>(api.derive.balances?.all, [stashId]);
  const currentAmount = useMemo(
    () => stakingInfo && stakingInfo.stakingLedger?.active?.unwrap(),
    [stakingInfo]
  );

  const startBalance = useMemo(
    () => calcBalance(api, stakingInfo, stashBalance),
    [api, stakingInfo, stashBalance]
  );

  return (
    <Modal
      header= {t<string>('Bond more funds')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns hint={t<string>('Since this transaction deals with funding, the stash account will be used.')}>
          <InputAddress
            defaultValue={stashId}
            isDisabled
            label={t<string>('stash account')}
          />
        </Modal.Columns>
        {startBalance && (
          <Modal.Columns hint={t<string>('The amount placed at-stake should allow some free funds for future transactions.')}>
            <InputBalance
              autoFocus
              defaultValue={startBalance}
              help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
              isError={!!amountError?.error || !maxAdditional || maxAdditional.eqn(0)}
              label={t<string>('additional bonded funds')}
              labelExtra={
                <BalanceFree
                  label={<span className='label'>{t<string>('balance')}</span>}
                  params={stashId}
                />
              }
              onChange={setMaxAdditional}
            />
            <ValidateAmount
              controllerId={controllerId}
              currentAmount={currentAmount}
              onError={setAmountError}
              stashId={stashId}
              value={maxAdditional}
            />
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO) || !!amountError?.error}
          label={t<string>('Bond more')}
          onStart={onClose}
          params={[maxAdditional]}
          tx={api.tx.staking.bondExtra}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
