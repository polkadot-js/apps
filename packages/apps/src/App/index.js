// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './App.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';

import Connecting from '../Connecting';
import Content from '../Content';
import SideBar from '../SideBar';
import translate from '../translate';

type Props = I18nProps & {};

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={classes('apps--App', className)}
      style={style}
    >
      <SideBar />
      <Content />
      <Connecting />
    </div>
  );
}

export default translate(App);
