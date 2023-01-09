// Copyright 2017-2023 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Balance } from '@polkadot/types/interfaces';

import React, { useCallback } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  balance?: Balance;
  voters?: AccountId[];
}

function Voters ({ balance, voters }: Props): React.ReactElement<Props> {
  const renderVoters = useCallback(
    () => voters && voters.map((who): React.ReactNode =>
      <AddressMini
        key={who.toString()}
        value={who}
        withLockedVote
      />
    ),
    [voters]
  );

  return (
    <>
      <td className='expand'>
        <ExpanderScroll
          className={balance ? '' : '--placeholder'}
          renderChildren={renderVoters}
          summary={<FormatBalance value={balance} />}
        />
      </td>
      <td className='number'>
        {voters
          ? formatNumber(voters.length)
          : <span className='--placeholder'>123</span>
        }
      </td>
    </>
  );
}

export default React.memo(Voters);
