// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from '../types';

import './Container.css';

import React from 'react';

type Props = BaseProps & {
  children: any // React$Node
};

export default function Container ({ children, className, style }: Props) {
  return (
    <div
      className={['ui--Container', className].join(' ')}
      style={style}
    >
      {children}
    </div>
  );
}
