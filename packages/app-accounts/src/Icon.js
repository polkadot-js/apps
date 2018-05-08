// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

type Props = {
  address: string | null
};

export default function Icon ({ address }: Props): React$Node {
  // flowlint-next-line sketchy-null-string:off
  if (!address) {
    return null;
  }

  return (
    <div className='accounts--Icon'>
      <IdentityIcon
        size={48}
        value={address}
      />
    </div>
  );
}
