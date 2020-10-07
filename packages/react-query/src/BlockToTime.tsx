// Copyright 2017-2020 @canvas-ui/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-api/types';

import BN from 'bn.js';
import React from 'react';
import { useBlockTime } from '@canvas-ui/react-hooks';

interface Props extends BareProps {
  blocks?: BN;
  children?: React.ReactNode;
  label?: React.ReactNode;
}

function BlockToTime ({ blocks, children, className = '', label }: Props): React.ReactElement<Props> | null {
  const [, text] = useBlockTime(blocks);

  if (blocks?.ltn(0)) {
    return null;
  }

  return (
    <div className={className}>
      {label || ''}{text}{children}
    </div>
  );
}

export default React.memo(BlockToTime);
