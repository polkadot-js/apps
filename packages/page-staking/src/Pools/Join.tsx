// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  id: AccountId;
  isDisabled?: boolean;
  params: Params;
}

function Join ({ className, id, isDisabled, params: { minNominatorBond } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();

  if (!minNominatorBond || isDisabled) {
    return null;
  }

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Join')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          label={t<string>('Join nomination pool')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t<string>('The account that is to join the pool.')}>
              <InputAddress
                label={t<string>('join pool from')}
                onChange={setAccount}
                type='account'
                value={accountId}
              />
            </Modal.Columns>
            <Modal.Columns hint={t<string>('The initial value to assign to the pool. It is set the the maximum of the minimum bond and the minium nomination value.')}>
              <InputBalance
                autoFocus
                defaultValue={minNominatorBond}
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
              label={t<string>('Join')}
              onStart={toggleOpen}
              params={[amount, id]}
              tx={api.tx.nominationPools.join}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Join);
