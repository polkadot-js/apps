// Copyright 2017-2022 @polkadot/app-ranked authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from '../types';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

interface Props {
  className?: string;
  value: MemberType;
}

function Member ({ className, value: { accountId, info } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number'>
        {formatNumber(info.rank)}
      </td>
    </tr>
  );
}

export default React.memo(Member);
