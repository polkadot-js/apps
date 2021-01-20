// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import React from 'react';
import styled from 'styled-components';

import { BaseProps } from './types';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
  padding: 1em 1em 0;
  height: 15vw;
  width: 15vw;
`;

function BaseChart ({ children, className = '' }: BaseProps): React.ReactElement<BaseProps> {
  return (
    <Wrapper className={classes('ui--Chart', className)}>
      {children}
    </Wrapper>
  );
}

export default React.memo(BaseChart);
