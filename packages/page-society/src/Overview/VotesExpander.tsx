// Copyright 2017-2022 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoteType } from '../types';

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
      {votes.map(([who]): React.ReactNode => (
        <AddressMini
          key={who.toString()}
          value={who}
        />
      ))}
    </Expander>
  );
}

export default React.memo(VotesExpander);
