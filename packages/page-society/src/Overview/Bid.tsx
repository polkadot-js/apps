// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Bid } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  value: Bid;
}

function BidRow ({ value: { kind, value, who } }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='all top'>
        <AddressSmall value={who} />
      </td>
      <td className='number top'>
        {kind.type}
      </td>
      <td className='number top'>
        <FormatBalance value={value} />
      </td>
    </tr>
  );
}

export default React.memo(BidRow);
