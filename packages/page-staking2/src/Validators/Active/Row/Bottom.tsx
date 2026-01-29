// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  isExpanded: boolean;
}

function Bottom ({ children, className = '', isExpanded }: Props): React.ReactElement<Props> | null {
  if (!isExpanded) {
    return null;
  }

  return (
    <tr className={`${className} isExpanded isLast`}>
      <td />
      <td />
      {children}
      <td />
    </tr>
  );
}

export default React.memo(Bottom);
