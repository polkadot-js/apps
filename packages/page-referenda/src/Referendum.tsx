// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletVote, Referendum as ReferendumType } from './types';

import React from 'react';

import { formatNumber } from '@polkadot/util';

import Ongoing from './Ongoing';

interface Props {
  className?: string;
  isMember: boolean;
  members?: string[];
  palletVote: PalletVote;
  value: ReferendumType;
}

function Referendum ({ className, isMember, members, palletVote, value: { id, info } }: Props): React.ReactElement<Props> {
  return (
    <tr className={ className }>
      <td className='number'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td>
        <textarea
          rows={8}
          style={{ width: 512 }}
        >{JSON.stringify(info.toHuman(), null, 2)}</textarea>
      </td>
      {info.type === 'Ongoing'
        ? (
          <Ongoing
            id={id}
            info={info}
            isMember={isMember}
            members={members}
            palletVote={palletVote}
          />
        )
        : (
          <td
            className='number'
            colSpan={3}
          >{info.type}</td>
        )
      }
    </tr>
  );
}

export default React.memo(Referendum);
