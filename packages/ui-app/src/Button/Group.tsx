// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GroupProps, GroupType } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';

import classes from '../util/classes';
import Divider from './Divider';

class ButtonGroup extends React.PureComponent<GroupProps> {
  render () {
    const { children, className, style } = this.props;

    return (
      <div
        className={classes('ui--Button-Group', className)}
        style={style}
      >
        <SUIButton.Group>
          <Divider style={{ padding: '0em' }} />
          {children}
        </SUIButton.Group>
      </div>
    );
  }
}

(ButtonGroup as GroupType).Divider = Divider;

export default (ButtonGroup as GroupType);
