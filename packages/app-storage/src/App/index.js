// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';

import './App.css';

import React from 'react';
import InputStorage from '@polkadot/ui-react-app/src/InputStorage';

import BestHash from '../BestHash';
import translate from '../translate';

type Props = I18nProps & {};

function App ({ className, style, t }: Props): React$Node {
  return (
    <div
      className={['storage--App', className].join(' ')}
      style={style}
    >
      <BestHash className='storage--App-BestHash' />
      <InputStorage />
    </div>
  );
}

export default translate(App);
