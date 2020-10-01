// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import { Link } from 'react-router-dom';
import { HeaderExtended } from '@polkadot/api-derive';
import { AddressMini } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  value: HeaderExtended,
}

function DID ({ value }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return (
    <tr>
      <td className='address'>
        {value.identity}
      </td>
    </tr>
  );
}

export default React.memo(DID);
