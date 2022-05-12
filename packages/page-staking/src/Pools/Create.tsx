// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useMemo, useState } from 'react';

import { Button, Input, InputAddress, InputBalance, InputNumber, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_ZERO, bnMax } from '@polkadot/util';

import { useTranslation } from '../translate';
import useAmountError from './useAmountError';

interface Props {
  className?: string;
  isDisabled?: boolean;
  ownAccounts?: string[];
  params: Params;
}

const MAX_META_LEN = 32;
const MIN_META_LEN = 3;

function Create ({ className, isDisabled, ownAccounts, params: { minCreateBond, minNominatorBond, nextPoolId } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN>(BN_ZERO);
  const [metadata, setMetadata] = useState('');

  const minValue = useMemo(
    () => minCreateBond && minNominatorBond &&
      bnMax(minCreateBond, minNominatorBond, api.consts.balances.existentialDeposit),
    [api, minCreateBond, minNominatorBond]
  );

  const isAmountError = useAmountError(accountId, amount, minValue);

  const isMetaError = useMemo(
    () => !metadata || (metadata.length < MIN_META_LEN) || (metadata.length > MAX_META_LEN),
    [metadata]
  );

  const extrinsic = useMemo(
    () => amount && accountId && !isAmountError && nextPoolId
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
                filter={ownAccounts}
                label={t<string>('create pool from')}
                onChange={setAccount}
                type='account'
                value={accountId}
                withExclude
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The initial value to assign to the pool. It is set to the maximum of the minimum bond and the minium nomination value.')}>
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
                isError={isMetaError}
                label={t<string>('description')}
                maxLength={MAX_META_LEN}
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
              isDisabled={!accountId || isAmountError || isMetaError}
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
