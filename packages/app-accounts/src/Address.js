// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';

import React from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import Button from 'semantic-ui-react/dist/es/elements/Button';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

type Props = BareProps & {
  value: string | null;
}

export default function Address ({ className, style, value }: Props): React$Node {
  if (!value) {
    return null;
  }

  const short = `${value.slice(0, 8)}…${value.slice(-8)}`;

  return (
    <div
      className={['accounts--Address', className].join(' ')}
      style={style}
    >
      <IdentityIcon
        className='accounts--Address-icon'
        size={128}
        value={value}
      />
      <div className='accounts--Address-data'>
        <div className='accounts--Address-address'>
          {short}
        </div>
        <CopyToClipboard text={value}>
          <Button
            icon='copy'
            primary
            size='tiny'
          />
        </CopyToClipboard>
      </div>
    </div>
  );
}
