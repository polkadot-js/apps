// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

type Props = BareProps & {
  address: string | null;
}

export default function Address ({ address, className, style }: Props): React$Node {
  return (
    <div
      className={['accounts--Address', 'ui disabled dropdown selection', className].join(' ')}
      style={style}
    >
      {
        // flowlint-next-line sketchy-null-string:off
        address
          ? (
            <IdentityIcon
              className='accounts--Address-icon'
              size={32}
              value={address}
            />
          )
          : null
      }
      <div className='accounts--Address-name'>
        {
          // flowlint-next-line sketchy-null-string:off
          address || 'unknown'
        }
      </div>
    </div>
  );
}
