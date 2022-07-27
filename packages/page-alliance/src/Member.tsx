// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType } from './types';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

interface Props {
  className?: string;
  info: MemberType;
}

function Member ({ className, info: { accountId, role } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='badge' />
      <td className='address all'>
        <AddressSmall value={accountId} />
      </td>
      <td className='number'>
        {role}
      </td>
    </tr>
  );
}

export default React.memo(Member);
