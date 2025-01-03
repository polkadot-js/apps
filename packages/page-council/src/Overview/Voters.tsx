// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useCallback } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  balance?: Balance;
  voters?: AccountId[];
}

function Voters ({ balance, voters }: Props): React.ReactElement<Props> {
  const renderVoters = useCallback(
    () => voters?.map((who): React.ReactNode =>
      <AddressMini
        key={who.toString()}
        value={who}
        withLockedVote
      />
    ),
    [voters]
  );

  return (
    <tr className='isExpanded isLast packedTop'>
      <td
        className='expand all'
        colSpan={2}
      >
        <ExpanderScroll
          renderChildren={renderVoters}
          summary={
            <FormatBalance
              className={balance && voters ? '' : '--tmp'}
              value={balance}
            />
          }
        />
      </td>
    </tr>
  );
}

export default React.memo(Voters);
