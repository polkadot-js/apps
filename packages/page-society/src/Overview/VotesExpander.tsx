// Copyright 2017-2020 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressMini, Expander } from '@polkadot/react-components';

import type { VoteType } from '../types';

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
