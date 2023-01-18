// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
  column: 0 | 1 | 2;
  numColumns: 1 | 2 | 3;
}

function BodySplit ({ children, className = '', column, numColumns }: Props): React.ReactElement<Props> {
  return (
    <tbody className={`${className} ui--Table-Body`}>
      {(children as React.ReactNode[]).filter((_, i) =>
        i % numColumns === column
      )}
    </tbody>
  );
}

export default React.memo(BodySplit);
