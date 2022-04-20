// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useRef, useState } from 'react';

import { Dropdown, InputBalance, Modal, TxButton } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceFree } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import PoolInfo from '../partials/PoolInfo';

interface Props {
  className?: string;
  controllerId: string;
  onClose: () => void;
  poolId: BN;
}

function BondExtra ({ className, controllerId, onClose, poolId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [type, setType] = useState('free');
  const [amount, setAmount] = useState(BN_ZERO);
  const balances = useCall<DeriveBalancesAll>(api.derive.balances.all, [controllerId]);

  const typeRef = useRef([
    { text: t<string>('Free balance'), value: 'free' },
    { text: t<string>('Pool rewards'), value: 'rewards' }
  ]);

  const isAmountError = type === 'free' && (
    !amount ||
    amount.isZero() ||
    (balances && amount.gte(balances.freeBalance))
  );

  return (
    <Modal
      className={className}
      header={t<string>('Bond extra into pool')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <PoolInfo
          controllerId={controllerId}
          poolId={poolId}
        />
        <Modal.Columns hint={t<string>('You can either bond a specific amount from your free balance, or all of the accumulated rewards.')}>
          <Dropdown
            defaultValue='free'
            label={t<string>('type of funds to bond')}
            onChange={setType}
            options={typeRef.current}
          />
          {type === 'free' && (
            <InputBalance
              autoFocus
              help={t<string>('Amount to add to the currently bonded funds. This is adjusted using the available funds on the account.')}
              isError={isAmountError}
              label={t<string>('additional free funds to bond')}
              labelExtra={
                <BalanceFree
                  label={<span className='label'>{t<string>('balance')}</span>}
                  params={controllerId}
                />
              }
              onChange={setAmount}
            />
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          icon='sign-in-alt'
          isDisabled={isAmountError}
          label={t<string>('Bond Extra')}
          onStart={onClose}
          params={[
            type === 'free'
              ? { FreeBalance: amount }
              : 'Rewards'
          ]}
          tx={api.tx.nominationPools.bondExtra}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(BondExtra);
