// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveBalancesAll, DeriveStakingAccount } from '@polkadot/api-derive/types';
import { AmountValidateState } from '../types';

import BN from 'bn.js';
import React, { useEffect, useMemo, useState } from 'react';
import { InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import ValidateAmount from './InputValidateAmount';

interface Props {
  controllerId: string | null;
  onClose: () => void;
  stakingInfo?: DeriveStakingAccount;
  stashId: string;
}

function BondExtra ({ controllerId, onClose, stakingInfo, stashId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amountError, setAmountError] = useState<AmountValidateState | null>(null);
  const [maxAdditional, setMaxAdditional] = useState<BN | undefined>();
  const [maxBalance] = useState<BN | undefined>();
  const [startBalance, setStartBalance] = useState<BN | null>(null);
  const stashBalance = useCall<DeriveBalancesAll>(api.derive.balances.all, [stashId]);
  const currentAmount = useMemo(
    () => stakingInfo && stakingInfo.stakingLedger?.active.unwrap(),
    [stakingInfo]
  );

  useEffect((): void => {
    if (stakingInfo && stakingInfo.stakingLedger && stashBalance) {
      const available = stashBalance.freeBalance.sub(stakingInfo.stakingLedger.active.unwrap());

      setStartBalance(
        available.gt(api.consts.balances.existentialDeposit)
          ? available.sub(api.consts.balances.existentialDeposit)
          : BN_ZERO
      );
    }
  }, [api, stakingInfo, stashBalance]);

  return (
    <Modal
      className='staking--BondExtra'
      header= {t<string>('Bond more funds')}
      size='large'
    >
      <Modal.Content>
        <Modal.Columns>
          <Modal.Column>
            <InputAddress
              defaultValue={stashId}
              isDisabled
              label={t<string>('stash account')}
            />
          </Modal.Column>
          <Modal.Column>
            <p>{t<string>('Since this transaction deals with funding, the stash account will be used.')}</p>
          </Modal.Column>
        </Modal.Columns>
        {startBalance && (
          <Modal.Columns>
            <Modal.Column>
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
                maxValue={maxBalance}
                onChange={setMaxAdditional}
              />
              <ValidateAmount
                controllerId={controllerId}
                currentAmount={currentAmount}
                onError={setAmountError}
                stashId={stashId}
                value={maxAdditional}
              />
            </Modal.Column>
            <Modal.Column>
              <p>{t<string>('The amount placed at-stake should allow some free funds for future transactions.')}</p>
            </Modal.Column>
          </Modal.Columns>
        )}
      </Modal.Content>
      <Modal.Actions onCancel={onClose}>
        <TxButton
          accountId={stashId}
          icon='sign-in-alt'
          isDisabled={!maxAdditional?.gt(BN_ZERO) || !!amountError?.error}
          label={t<string>('Bond more')}
          onStart={onClose}
          params={[maxAdditional]}
          tx='staking.bondExtra'
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
