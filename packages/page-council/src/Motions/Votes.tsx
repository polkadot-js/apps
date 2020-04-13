// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressMini } from '@polkadot/react-components';

interface Props {
  votes: AccountId[];
}

function Votes ({ votes }: Props): React.ReactElement<Props> {
  return (
    <td className='address'>
      {votes.map((address): React.ReactNode => (
        <AddressMini
          key={address.toString()}
          value={address}
          withBalance={false}
        />
      ))}
    </td>
  );
}

export default React.memo(Votes);
