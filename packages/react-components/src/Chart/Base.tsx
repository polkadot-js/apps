// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';
import styled from 'styled-components';

import { classes } from '../util';

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
