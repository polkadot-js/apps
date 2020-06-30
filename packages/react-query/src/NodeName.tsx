// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
