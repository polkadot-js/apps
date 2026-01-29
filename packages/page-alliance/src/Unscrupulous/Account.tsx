// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

interface Props {
  className?: string;
  value: string;
}

function Account ({ className, value }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='address all'>
        <AddressSmall value={value} />
      </td>
    </tr>
  );
}

export default React.memo(Account);
