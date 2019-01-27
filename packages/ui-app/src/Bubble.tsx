// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';
import { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';

import React from 'react';
import SUILabel from 'semantic-ui-react/dist/commonjs/elements/Label/Label';
import settings from '@polkadot/ui-settings';

import classes from './util/classes';
import Icon from './Icon';

type Props = BareProps & {
  children: React.ReactNode,
  color?: SemanticCOLORS,
  icon?: SemanticICONS,
  label?: React.ReactNode
};

export default class Bubble extends React.PureComponent<Props> {
  render () {
    const { color, children, className, icon, label } = this.props;

    return (
      <SUILabel
        className={classes(`theme--${settings.uiTheme}`, 'ui--Bubble', className)}
        color={color}
      >
        <div className='ui--Bubble-header'>
          {
            icon
              ? <Icon name={icon} size='large' />
              : undefined
          }
          {
            label
              ? <div className='text'>{label}</div>
              : undefined
          }
        </div>
        <div className='ui--Bubble-children'>
          {children}
        </div>
      </SUILabel>
    );
  }
}
