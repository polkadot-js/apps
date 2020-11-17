// Copyright 2017-2020 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  children?: React.ReactNode;
  className?: string;
  label?: React.ReactNode;
}

function NodeVersion ({ children, className = '', label }: Props): React.ReactElement<Props> {
  const { systemVersion } = useApi();

  // eg. 0.1.0-90d0bb6-x86_64-macos
  const displayVersion = systemVersion.split('-')[0];

  return (
    <div className={className}>
      {label || ''}{displayVersion}{children}
    </div>
  );
}

export default React.memo(NodeVersion);
