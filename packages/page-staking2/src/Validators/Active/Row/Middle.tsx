// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  isExpanded: boolean;
}

function Middle ({ children, className = '', isExpanded }: Props): React.ReactElement<Props> {
  return (
    <tr className={`${className} isExpanded ${isExpanded ? '' : 'isLast'} packedTop`}>
      <td />
      {children}
      <td />
    </tr>
  );
}

export default React.memo(Middle);
