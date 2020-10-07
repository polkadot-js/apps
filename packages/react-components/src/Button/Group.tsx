// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { GroupProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';

function ButtonGroup ({ children, className = '', isBasic, isCentered }: GroupProps): React.ReactElement<GroupProps> {
  return (
    <div className={`${className} ui--Button-Group ${isCentered ? 'centered' : ''}`}>
      <SUIButton.Group
        basic={isBasic}
        size='small'
      >
        {children}
      </SUIButton.Group>
    </div>
  );
}

export default React.memo(styled(ButtonGroup)`
  :not(:first-child) {
    margin-top: 0.75rem;
  }

  > .ui.buttons {
    vertical-align: middle;
  }

  &.centered {
    margin-bottom: 0.5rem;
    text-align: center;
  }

  &+.ui--Table {
    margin-top: 1.5rem;
  }
`);
