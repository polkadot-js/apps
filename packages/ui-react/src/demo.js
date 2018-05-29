// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import './demo.css';

import React from 'react';
import ReactDOM from 'react-dom';

import IdentityIcon from './IdentityIcon/Demo';

const element = document.getElementById('demo');

if (!element) {
  throw new Error('Unable to find #demo element');
}

ReactDOM.render(
  <div className='ui--Demo'>
    <IdentityIcon />
  </div>,
  element
);
