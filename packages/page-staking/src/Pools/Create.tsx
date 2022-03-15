// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';
import { BN_ONE, bnMax } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isDisabled?: boolean;
  params: Params;
}

function Create ({ className, isDisabled, params: { minCreateBond, minNominatorBond } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const lastPoolId = useCall<BN>(api.query.nominationPools.lastPoolId);
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();

  const minValue = useMemo(
    () => minCreateBond && minNominatorBond && bnMax(minCreateBond, minNominatorBond),
    [minCreateBond, minNominatorBond]
  );

  const nextPoolId = useMemo(
    () => lastPoolId && lastPoolId.add(BN_ONE),
    [lastPoolId]
  );

  const isAmountError = useMemo(
    () => !amount || !minValue || amount.lt(minValue),
    [amount, minValue]
  );

  return (
    <>
      <Button
        icon='plus'
        isDisabled={isDisabled || !minValue}
        label={t<string>('Add pool')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Create nomination pool')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The origin account will also be set as the pool admin, nominator and state toggler.')}>
              <InputAddress
                label={t<string>('create pool from')}
                onChange={setAccount}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The initial value to assign to the pool. It is set the the maximum of the minimum bond and the minium nomination value.')}>
              <InputBalance
                autoFocus
                defaultValue={minValue}
                isError={isAmountError}
                label={t<string>('initial value')}
                onChange={setAmount}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The id that will be assigned to this nomination pool.')}>
              <InputNumber
                defaultValue={nextPoolId}
                isDisabled
                label={t<string>('pool id')}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || isAmountError}
              label={t<string>('Create')}
              onStart={toggleOpen}
              params={[amount, accountId, accountId, accountId]}
              tx={api.tx.nominationPools.create}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Create);
