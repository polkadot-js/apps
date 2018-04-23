// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './App.css';

import React from 'react';
import BestNumber from '@polkadot/rx-react/BestNumber';

import BestHash from '../BestHash';
import BlockHeaders from '../BlockHeaders';

type Props = BaseProps & {};

export default function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['explorer--App', className].join(' ')}
      style={style}
    >
      <BestNumber
        className='explorer--App-BestNumber'
        label='best #'
      />
      <BestHash className='explorer--App-BestHash' />
      <BlockHeaders />
    </div>
  );
}
