// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BalanceOf, BidKind } from '@polkadot/types/interfaces';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import BidType from '../Candidates/BidType';

interface Props {
  balance?: BalanceOf;
  bid?: BidKind;
  value: AccountId;
}

function Suspension ({ balance, bid, value }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={value} />
      </td>
      <BidType value={bid} />
      <td className='number'>
        {balance && (
          <FormatBalance value={balance} />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Suspension);
