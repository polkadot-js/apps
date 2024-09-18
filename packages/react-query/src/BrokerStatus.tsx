// Copyright 2017-2024 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useBrokerStatus } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
  query: string;
}

function BrokerStatus ({ children, className = '', query }: Props): React.ReactElement<Props> {
  const info = useBrokerStatus(query) || '-';

  return (
    <div className={className}>
      {info}
      {children}
    </div>
  );
}

export default React.memo(BrokerStatus);
