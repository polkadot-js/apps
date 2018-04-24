// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './App.css';

import React from 'react';
import { translate } from 'react-i18next';

import Connecting from '../Connecting';
import Content from '../Content';
import SideBar from '../SideBar';

type Props = BaseProps & {};

function App ({ className, style }: Props) {
  return (
    <div
      className={['portal--App', className].join(' ')}
      style={style}
    >
      <SideBar className='portal--App-column' />
      <Content className='portal--App-column' />
      <Connecting />
    </div>
  );
}

export default translate(['portal'])(App);
