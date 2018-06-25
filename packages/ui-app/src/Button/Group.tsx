// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { GroupProps, GroupType } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import Button from '@polkadot/ui-app/Button';
import classes from '../util/classes';
import Divider from './Divider';

function ButtonGroup ({ children, className, style }: GroupProps) {
  return (
    <div
      className={classes('ui--Button-Group', className)}
      style={style}
    >
      <SUIButton.Group>
        <Button.Group.Divider style={{ padding: '0em' }} />
        {children}
      </SUIButton.Group>
    </div>
  );
}

(ButtonGroup as GroupType).Divider = Divider;

export default (ButtonGroup as GroupType);
