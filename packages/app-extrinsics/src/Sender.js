// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from './types';

import React from 'react';

import Account from './Account';
import { senderAddr } from './subjects';

type Props = BaseProps & {};

export default function Sender (props: Props) {
  return (
    <Account
      {...props}
      className={['extrinsics--Sender', props.className].join(' ')}
      label='using the selected account'
      subject={senderAddr}
    />
  );
}
