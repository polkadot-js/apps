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
  const displayVersion = systemVersion.split('-').filter((_, index) => index <= 1).join('-');

  return (
    <div className={className}>
      {label || ''}{displayVersion}{children}
    </div>
  );
}

export default React.memo(NodeVersion);
