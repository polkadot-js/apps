// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './SideBar.css';

import React from 'react';
import { translate } from 'react-i18next';
import Menu from 'semantic-ui-react/dist/es/collections/Menu';

import routing from '../routing';
import Item from './Item';

type Props = BaseProps & {};

function SideBar ({ className, style, t }: Props) {
  return (
    <div
      className={['portal--SideBar', className].join(' ')}
      style={style}
    >
      <Menu
        secondary
        vertical
      >
        {
          routing.routes.map((props) => (
            <Item
              key={props.name}
              t={t}
              {...props}
            />
          ))
        }
      </Menu>
    </div>
  );
}

export default translate(['portal'])(SideBar);
