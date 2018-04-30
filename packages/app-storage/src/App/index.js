// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './App.css';

import React from 'react';

import translate from '../translate';
import BestHash from '../BestHash';

type Props = BaseProps & {};

function App ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--App', className].join(' ')}
      style={style}
    >
      <BestHash className='storage--App-BestHash' />
    </div>
  );
}

export default translate(App);
