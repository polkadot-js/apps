// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteType } from '../types';

import React from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';

interface Props {
  label: string;
  votes: VoteType[];
}

function VotesExpander ({ label, votes }: Props): React.ReactElement<Props> | null {
  if (votes.length === 0) {
    return null;
  }

  return (
    <Expander summary={`${label} (${votes.length})`}>
      {votes.map(([who]): React.ReactNode =>
        <AddressMini
          key={who.toString()}
          value={who}
        />
      )}
    </Expander>
  );
}

export default React.memo(VotesExpander);
