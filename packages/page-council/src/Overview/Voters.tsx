// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Balance } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

interface Props {
  balance?: Balance;
  voters?: AccountId[];
}

function Voters ({ balance, voters }: Props): React.ReactElement<Props> | null {
  if (!balance || !voters || !voters.length) {
    return null;
  }

  return (
    <Expander
      summary={
        <FormatBalance
          labelPost={` (${voters.length})`}
          value={balance}
        />
      }
    >
      {voters.map((who): React.ReactNode =>
        <AddressMini
          key={who.toString()}
          value={who}
          withLockedVote
        />
      )}
    </Expander>
  );
}

export default React.memo(Voters);
