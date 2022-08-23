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
import {rpcNetwork} from "@polkadot/react-api/util/getEnvironment";

interface Props {
  controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}

function calcBalance (api: ApiPromise, stakingInfo?: DeriveStakingAccount, stashBalance?: DeriveBalancesAll, isDarwinia?:boolean): BN | null {
  if (stakingInfo && stakingInfo.stakingLedger && stashBalance) {
    const sumUnlocking = (stakingInfo.unlocking || []).reduce((acc, { value }) => acc.iadd(value), new BN(0));
    const redeemable = stakingInfo.redeemable || BN_ZERO;
    let available
    if(isDarwinia) {
      available = stashBalance.freeBalance.sub(stashBalance.lockedBalance);
    } else {
      available = stashBalance.freeBalance.sub(stakingInfo.stakingLedger.active?.unwrap() || BN_ZERO).sub(sumUnlocking).sub(redeemable);
    }
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
  const isDarwinia = rpcNetwork.isDarwinia();

  const startBalance = useMemo(
    () => calcBalance(api, stakingInfo, stashBalance, isDarwinia),
    [api, isDarwinia, stakingInfo, stashBalance]
  );

  const getDarwiniaQueryParams = () => {
    /* Default promise months to zero since the user has no option to change the number of
    * months that he wants to freeze his tokens like the way it is for the Darwinia Apps website */
    const promiseMonths = 0;
    if(!maxAdditional) {
      return [{'ringbalance': '0'}, promiseMonths];
    }
    return [{'ringbalance': maxAdditional?.toString()}, promiseMonths];
  }

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
              isError={!!amountError?.error || !maxAdditional || maxAdditional.isZero()}
              label={t<string>('additional funds to bond')}
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
          params={isDarwinia ? getDarwiniaQueryParams() : [maxAdditional]}
          tx={api.tx.staking.bondExtra}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
