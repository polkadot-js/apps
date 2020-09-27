// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import { classes } from '@polkadot/react-components/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
}

function Bare ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={classes('ui--row', className)}>
      {children}
    </div>
  );
}

export default React.memo(styled(Bare)`
  position: relative;
`);
