// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './App.css';

import React from 'react';

import Best from '../Best';
import BlockHeaders from '../BlockHeaders';
import translate from '../translate';

type Props = I18nProps & {};

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['explorer--App', className].join(' ')}
      style={style}
    >
      <Best className='explorer--App-Best' />
      <BlockHeaders className='explorer--App-Headers' />
    </div>
  );
}

export default translate(App);
