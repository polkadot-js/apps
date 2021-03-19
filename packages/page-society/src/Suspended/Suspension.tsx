// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

interface Props {
  value: AccountId;
}

function Suspension ({ value }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={value} />
      </td>
    </tr>
  );
}

export default React.memo(Suspension);
