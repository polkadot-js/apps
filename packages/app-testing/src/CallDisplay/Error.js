// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps } from '@polkadot/portal/types';

import './CallDisplay.css';

import React from 'react';

export default function Error (props: BaseProps): React$Node {
  return (
    <div className='testing--CallDisplay-error'>
      ERROR: Invalid or unimplemented extrinsic function
    </div>
  );
}
