// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '../types';

import './CallDisplay.css';

import React from 'react';

export default function Error ({ className, style }: BaseProps): React$Node {
  return (
    <div
      className={['testing--CallDisplay-error', className].join(' ')}
      style={style}
    >
      ERROR: Invalid or unimplemented extrinsic function
    </div>
  );
}
