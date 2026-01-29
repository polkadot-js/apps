// Copyright 2017-2025 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '../types.js';

import React from 'react';

import Members from './Members.js';
import Summary from './Summary.js';

function Overview ({ className = '', isMember, members, prime, proposalHashes, type }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        isMember={isMember}
        members={members}
        proposalHashes={proposalHashes}
        type={type}
      />
      <Members
        members={members}
        prime={prime}
      />
    </div>
  );
}

export default React.memo(Overview);
