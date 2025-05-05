// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi, useCall } from '@polkadot/react-hooks';

import FormatBalance from './FormatBalance.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function TotalInactive ({ children, className = '', label }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const inactiveIssuance = useCall<string>(api.query.balances?.inactiveIssuance);

  return (
    <div className={className}>
      {label || ''}
      <FormatBalance
        className={inactiveIssuance ? '' : '--tmp'}
        value={inactiveIssuance || 1}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(TotalInactive);
