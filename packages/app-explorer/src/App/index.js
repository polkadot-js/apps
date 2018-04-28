// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './App.css';

import React from 'react';
import BestNumber from '@polkadot/rx-react/BestNumber';

import translate from '../translate';
import BestHash from '../BestHash';
import BlockHeaders from '../BlockHeaders';

type Props = BaseProps & {};

function App ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['explorer--App', className].join(' ')}
      style={style}
    >
      <BestNumber
        className='explorer--App-BestNumber'
        label={t('app.bestNumber', {
          defaultValue: 'best #'
        })}
      />
      <BestHash className='explorer--App-BestHash' />
      <BlockHeaders />
    </div>
  );
}

export default translate(App);
