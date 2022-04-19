// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';

import React from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId?: string | null;
  poolId?: u32;
}

function PoolInfo ({ className = '', controllerId, poolId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!poolId || !controllerId) {
    return null;
  }

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('The stash that is to be affected. The transaction will be sent from the associated controller account.')}
    >
      <InputNumber
        defaultValue={poolId}
        isDisabled
        label={t<string>('pool id')}
      />
      <InputAddress
        defaultValue={controllerId}
        isDisabled
        label={t<string>('nominator account')}
      />
    </Modal.Columns>
  );
}

export default React.memo(PoolInfo);
