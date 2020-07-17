// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useContext } from 'react';

import { WindowDimensionsCtx } from '../WindowDimensions';

interface Props {
  children: React.ReactNode;
  className?: string;
  minWidth: number;
}

function ResponsiveHide ({ children, className, minWidth }: Props): React.ReactElement<Props> | null {
  const { windowWidth } = useContext(WindowDimensionsCtx);

  if (windowWidth < minWidth) {
    return null;
  }

  return (
    <div className={className}>
      {children}
    </div>
  );
}

export default React.memo(ResponsiveHide);
