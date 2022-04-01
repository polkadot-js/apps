// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types';

import React, { useMemo, useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { bnMax } from '@polkadot/util';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  id: BN;
  isDisabled?: boolean;
  params: Params;
}

function Join ({ className, id, isDisabled, params: { minJoinBond, minNominatorBond } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();

  const minAmount = useMemo(
    () => minJoinBond && minNominatorBond && bnMax(minJoinBond, minNominatorBond),
    [minJoinBond, minNominatorBond]
  );

  const isAmountError = useMemo(
    () => !amount || !minAmount || amount.lt(minAmount),
    [amount, minAmount]
  );

  if (isDisabled) {
    return null;
  }

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!minAmount}
        label={t<string>('Join')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t<string>('Join nomination pool')}
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
                defaultValue={minAmount}
                isError={isAmountError}
                label={t<string>('initial value')}
                onChange={setAmount}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || isAmountError}
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
