// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './IdentityIcon.css';

import React from 'react';

import appendIcon from './appendIcon';

type Props = BaseProps & {
  size?: number,
  value: string | Uint8Array
};

export default function IdentityIcon ({ className, size = 64, style, value }: Props) {
  return (
    <div
      className={['ui--IdentityIcon', className].join(' ')}
      ref={appendIcon(value, size)}
      style={style}
    />
  );
}
