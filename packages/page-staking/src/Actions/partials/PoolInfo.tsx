// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React from 'react';

import { InputAddress, InputNumber, Modal } from '@polkadot/react-components';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  controllerId?: string | null;
  poolId?: BN;
}

function PoolInfo ({ className = '', controllerId, poolId }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!poolId || !controllerId) {
    return null;
  }

  return (
    <Modal.Columns
      className={className}
      hint={t<string>('The pool and pool member that is to be affected. The transaction will be sent from the associated pool member account.')}
    >
      <InputNumber
        defaultValue={poolId}
        isDisabled
        label={t<string>('pool id')}
      />
      <InputAddress
        defaultValue={controllerId}
        isDisabled
        label={t<string>('member account')}
      />
    </Modal.Columns>
  );
}

export default React.memo(PoolInfo);
