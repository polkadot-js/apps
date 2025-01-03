// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Bare ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`${className} ui--row --relative`}>
      {children}
    </div>
  );
}

export default React.memo(Bare);
