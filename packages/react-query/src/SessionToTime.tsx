// Copyright 2017-2022 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';

import React, { useMemo } from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

import BlockToTime from './BlockToTime';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isInline?: boolean;
  label?: React.ReactNode;
  value?: BN;
}

function SessionToTime ({ children, className, isInline, label, value }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);

  const blocks = useMemo(
    () => sessionInfo && value && sessionInfo.currentIndex.lt(value)
      ? value
        .sub(sessionInfo.currentIndex)
        .imul(sessionInfo.sessionLength)
        .isub(sessionInfo.sessionProgress)
      : BN_ZERO,
    [sessionInfo, value]
  );

  return (
    <BlockToTime
      className={className}
      isInline={isInline}
      label={label}
      value={blocks}
    >
      {children}
    </BlockToTime>
  );
}

export default React.memo(SessionToTime);
