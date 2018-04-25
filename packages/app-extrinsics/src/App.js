// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';

import CallDisplay from './CallDisplay';
import CallSelect from './CallSelect';
import Nonce from './Nonce';
import Sender from './Sender';
import Signer from './Signer';
import translate from './translate';

type Props = BaseProps & {};

function App ({ className, style }: Props): React$Node {
  return (
    <div
      className={['extrinsics--App', className].join(' ')}
      style={style}
    >
      <Sender />
      <CallSelect />
      <Nonce />
      <CallDisplay />
      <Signer />
    </div>
  );
}

export default translate(App);
