// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

interface Props {
  address: string;
  className?: string;
}

function Member ({ address, className }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
    </tr>
  );
}

export default React.memo(Member);
