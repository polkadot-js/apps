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

function NodeVersion ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { systemVersion } = useApi();
  const displayVersion = systemVersion.split('-').filter((_, index) => index <= 1).join('-');

  return (
    <div className={className}>
      {label || ''}{displayVersion}{children}
    </div>
  );
}

export default React.memo(NodeVersion);
