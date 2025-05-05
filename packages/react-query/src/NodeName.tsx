// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function NodeName ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { systemName } = useApi();

  return (
    <div className={className}>
      {label || ''}{systemName}{children}
    </div>
  );
}

export default React.memo(NodeName);
