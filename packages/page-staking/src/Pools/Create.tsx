// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useMemo, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
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
  const [metadata, setMetadata] = useState('');

  const minValue = useMemo(
    () => minCreateBond && minNominatorBond &&
      bnMax(minCreateBond, minNominatorBond, api.consts.balances.existentialDeposit),
    [api, minCreateBond, minNominatorBond]
  );

  const nextPoolId = useMemo(
    () => lastPoolId && lastPoolId.add(BN_ONE),
    [lastPoolId]
  );

  const isAmountError = useMemo(
    () => !amount || !minValue || amount.lt(minValue),
    [amount, minValue]
  );

  const extrinsic = useMemo(
    () => accountId && !isAmountError
      ? api.tx.utility.batch([
        api.tx.nominationPools.create(amount, accountId, accountId, accountId),
        api.tx.nominationPools.setMetadata(nextPoolId, metadata)
      ])
      : null,
    [api, accountId, amount, isAmountError, metadata, nextPoolId]
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
            <Modal.Columns hint={t<string>('The metadata description to set for this pool')}>
              <Input
                label={t<string>('description')}
                maxLength={32}
                onChange={setMetadata}
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
              extrinsic={extrinsic}
              icon='plus'
              isDisabled={!accountId || isAmountError}
              label={t<string>('Create')}
              onStart={toggleOpen}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Create);
