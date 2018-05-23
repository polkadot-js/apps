// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';

import './App.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import Signer from '@polkadot/ui-signer';

import Connecting from '../Connecting';
import Content from '../Content';
import SideBar from '../SideBar';

type Props = BareProps & {};

export default function Apps ({ className, style }: Props): React$Node {
  return (
    <div
      className={classes('apps--App', className)}
      style={style}
    >
      <SideBar />
      <Signer>
        <Content />
      </Signer>
      <Connecting />
    </div>
  );
}
