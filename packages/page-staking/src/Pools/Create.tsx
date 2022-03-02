// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCallMulti, useToggle } from '@polkadot/react-hooks';
import { bnMax } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Create ({ className }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const [minCreate, minNominate] = useCallMulti<[BN, BN]>([
    api.query.nominatorPools.minCreateBond,
    api.query.staking.minNominatorBond
  ]);

  if (!minCreate || !minNominate) {
    return null;
  }

  const startValue = bnMax(minCreate, minNominate);

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Add pool')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          label={t<string>('Create nomination pool')}
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
                defaultValue={startValue}
                isError={amount}
                label={t<string>('initial value')}
                onChange={setAmount}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId}
              label={t<string>('Create')}
              onStart={toggleOpen}
              params={[amount, 0, accountId, accountId, accountId]}
              tx={api.tx.nominationPools.create}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Create);
