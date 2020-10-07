// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '@canvas-ui/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  children?: React.ReactNode;
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
