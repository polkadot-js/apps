// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/es/elements/Button';

import Button from '@polkadot/ui-app/Button';
import classes from '../util/classes';
import Divider from './Divider';

type Props = BareProps & {
  children?: React$Node
};

function ButtonGroup ({ children, className, style }: Props): React$Node {
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

ButtonGroup.Divider = Divider;

export default ButtonGroup;
