// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GroupProps, GroupType } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';

import { classes } from '../util';
import Divider from './Divider';

function ButtonGroup ({ children, className, isBasic = false, isCentered = false, style }: GroupProps): React.ReactElement<GroupProps> {
  return (
    <div
      className={classes('ui--Button-Group', isCentered ? 'centered' : '', className)}
      style={style}
    >
      <SUIButton.Group basic={isBasic}>
        {
          isBasic
            ? null
            : <Divider style={{ padding: '0em' }} />
        }
        {children}
      </SUIButton.Group>
    </div>
  );
}

(ButtonGroup as GroupType).Divider = Divider;

export default styled(ButtonGroup)`
  text-align: right;

  :not(:first-child) {
    margin-top: 0.75rem;
  }

  &.centered {
    margin-bottom: 0.5rem;
    text-align: center;
  }
` as unknown as GroupType;
