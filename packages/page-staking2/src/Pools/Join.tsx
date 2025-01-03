// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Params } from './types.js';

import React, { useState } from 'react';

import { Button, InputAddress, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import useAmountError from './useAmountError.js';

interface Props {
  className?: string;
  isDisabled?: boolean;
  ownAccounts?: string[];
  params: Params;
  poolId: BN;
}

function Join ({ className, isDisabled, ownAccounts, params: { minMemberBond }, poolId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isOpen, toggleOpen] = useToggle();
  const [accountId, setAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<BN | undefined>();
  const isAmountError = useAmountError(accountId, amount, minMemberBond);

  if (isDisabled) {
    return null;
  }

  return (
    <>
      <Button
        icon='plus'
        isDisabled={!minMemberBond}
        label={t('Join')}
        onClick={toggleOpen}
      />
      {isOpen && (
        <Modal
          className={className}
          header={t('Join nomination pool')}
          onClose={toggleOpen}
          size='large'
        >
          <Modal.Content>
            <Modal.Columns hint={t('The account that will join the pool.')}>
              <InputAddress
                filter={ownAccounts}
                label={t('join pool from')}
                onChange={setAccount}
                type='account'
                value={accountId}
                withExclude
              />
            </Modal.Columns>
            <Modal.Columns hint={t('The initial value to assign to the pool. It is set to the minimum value required to join a pool.')}>
              <InputBalance
                autoFocus
                defaultValue={minMemberBond}
                isError={isAmountError}
                label={t('initial value')}
                onChange={setAmount}
              />
            </Modal.Columns>
          </Modal.Content>
          <Modal.Actions>
            <TxButton
              accountId={accountId}
              icon='plus'
              isDisabled={!accountId || isAmountError}
              label={t('Join')}
              onStart={toggleOpen}
              params={[amount, poolId]}
              tx={api.tx.nominationPools.join}
            />
          </Modal.Actions>
        </Modal>
      )}
    </>
  );
}

export default React.memo(Join);
