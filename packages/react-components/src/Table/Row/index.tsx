// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function RowBase ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <tr className={`${className} ui--Table-Row`}>
      {children}
    </tr>
  );
}

const Row = React.memo(RowBase) as unknown as typeof RowBase;

export default Row;
