// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { InputBalance, Modal, Static, TxButton } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockToTime, FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../../translate.js';
import PoolInfo from '../partials/PoolInfo.js';
import useUnbondDuration from '../useUnbondDuration.js';

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
  const [amount, setAmount] = useState<BN | undefined>();
  const bondedBlocks = useUnbondDuration();

  const isAmountError = !amount || !maxUnbond || amount.gt(maxUnbond);

  return (
    <Modal
      className={className}
      header={t('Unbond funds from pool')}
      onClose={onClose}
      size='large'
    >
      <Modal.Content>
        <PoolInfo
          controllerId={controllerId}
          poolId={poolId}
        />
        <Modal.Columns hint={t('The amount to unbond. It should be less or equal to the full bonded amount.')}>
          <InputBalance
            autoFocus
            defaultValue={maxUnbond}
            isError={isAmountError}
            label={t('amount to unbond')}
            labelExtra={
              <FormatBalance
                label={<span className='label'>{t('bonded')}</span>}
                value={maxUnbond}
              />
            }
            maxValue={maxUnbond}
            onChange={setAmount}
            withMax
          />
          {bondedBlocks?.gtn(0) && (
            <Static
              label={t('on-chain bonding duration')}
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
          isDisabled={isAmountError}
          label={t('Unbond')}
          onStart={onClose}
          params={[controllerId, amount]}
          tx={api.tx.nominationPools.unbond}
        />
      </Modal.Actions>
    </Modal>
  );
}

export default React.memo(Unbond);
