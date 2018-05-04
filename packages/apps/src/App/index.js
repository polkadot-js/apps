// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './App.css';

import React from 'react';

import Connecting from '../Connecting';
import Content from '../Content';
import SideBar from '../SideBar';
import translate from '../translate';

type Props = I18nProps & {};

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['apps--App', className].join(' ')}
      style={style}
    >
      <SideBar className='apps--App-column' />
      <Content className='apps--App-column' />
      <Connecting />
    </div>
  );
}

export default translate(App);
