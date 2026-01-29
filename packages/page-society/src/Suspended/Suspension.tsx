// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BalanceOf } from '@polkadot/types/interfaces';
import type { PalletSocietyBidKind } from '@polkadot/types/lookup';

import React from 'react';

import { AddressSmall, Table } from '@polkadot/react-components';

import BidType from '../Candidates/BidType.js';

interface Props {
  balance?: BalanceOf;
  bid?: PalletSocietyBidKind;
  value: AccountId;
}

function Suspension ({ balance, bid, value }: Props): React.ReactElement<Props> {
  return (
    <tr>
      <td className='address all'>
        <AddressSmall value={value} />
      </td>
      <td className='start'>
        <BidType value={bid} />
      </td>
      <Table.Column.Balance value={balance} />
    </tr>
  );
}

export default React.memo(Suspension);
