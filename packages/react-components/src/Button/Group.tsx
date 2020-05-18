// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GroupProps, GroupType } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import styled from 'styled-components';

import Divider from './Divider';

const DIVIDER_STYLE = { padding: '0em' };

function ButtonGroup ({ children, className, isBasic, isCentered, style }: GroupProps): React.ReactElement<GroupProps> {
  return (
    <div
      className={`ui--Button-Group ${isCentered && 'centered'} ${className}`}
      style={style}
    >
      <SUIButton.Group
        basic={isBasic}
        size='small'
      >
        {isBasic
          ? null
          : <Divider style={DIVIDER_STYLE} />
        }
        {children}
      </SUIButton.Group>
    </div>
  );
}

const Memo = React.memo(styled(ButtonGroup)`
  text-align: right;

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
`) as unknown as GroupType;

Memo.Divider = Divider;

export default Memo;
