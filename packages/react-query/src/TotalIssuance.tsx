// Copyright 2017-2021 @polkadot/react-query authors & contributors
// and @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-api/types';
import { useApi, useCall } from '@canvas-ui/react-hooks';
import React from 'react';

import FormatBalance from '@canvas-ui/react-components/FormatBalance';

interface Props extends BareProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
}

function TotalIssuance ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const totalIssuance = useCall<string>(api.query.balances?.totalIssuance, []);

  return (
    <div className={className}>
      {label || ''}
      <FormatBalance
        value={totalIssuance}
        withSi
      />
      {children}
    </div>
  );
}

export default React.memo(TotalIssuance);
