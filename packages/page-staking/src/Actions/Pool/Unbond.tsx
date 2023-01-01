// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputBalance, Modal, Static, Toggle, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';
import PoolInfo from '../partials/PoolInfo';
import useUnbondDuration from '../useUnbondDuration';

interface Props {
  className?: string;
  controllerId: string;
  maxUnbond: BN;
  onClose: () => void;
  poolId: BN;
}

function Unbond ({ className, controllerId, maxUnbond, onClose, poolId }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [amount, setAmount] = useState(BN_ZERO);
  const [withMax, setWithMax] = useState(false);
  const bondedBlocks = useUnbondDuration();

  const isAmountError = !amount || !maxUnbond || amount.gt(maxUnbond);

  return (
    <Modal
      className={className}
      header={t<string>('Unbond funds from pool')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <PoolInfo
          controllerId={controllerId}
          poolId={poolId}
        />
        <Modal.Columns hint={t<string>('The amount to unbond. It should be less or equal to the full bonded amount.')}>
          <InputBalance
            autoFocus
            defaultValue={maxUnbond}
            help={t<string>('Amount to unbond from the current bonded amount.')}
            isDisabled={withMax}
            isError={isAmountError}
            key={`unbondAmount-${withMax.toString()}`}
            label={t<string>('amount to unbond')}
            labelExtra={
              <FormatBalance
                label={<span className='label'>{t<string>('bonded')}</span>}
                value={maxUnbond}
              />
            }
            maxValue={maxUnbond}
            onChange={setAmount}
            withMax
          >
            <Toggle
              isOverlay
              label={t<string>('all bonded')}
              onChange={setWithMax}
              value={withMax}
            />
          </InputBalance>
          {bondedBlocks?.gtn(0) && (
            <Static
              help={t<string>('The bonding duration for any staked funds. After this period needs to be withdrawn.')}
              label={t<string>('on-chain bonding duration')}
            >
              <BlockToTime value={bondedBlocks} />
            </Static>
          )}
        </Modal.Columns>
      </Modal.Content>
      <Modal.Actions>
        <TxButton
          accountId={controllerId}
          icon='unlock'
          isDisabled={!withMax && isAmountError}
          label={t<string>('Unbond')}
          onStart={onClose}
          params={[controllerId, withMax ? maxUnbond : amount]}
          tx={api.tx.nominationPools.unbond}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Unbond);
