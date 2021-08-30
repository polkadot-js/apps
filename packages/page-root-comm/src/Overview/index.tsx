// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ComponentProps as Props } from '../types';

import React from 'react';

import Members from './Members';
import Summary from './Summary';

<<<<<<< HEAD
function Overview ({ className = '', isMember, members, prime, proposalHashes, type }: Props): React.ReactElement<Props> {
=======
function Overview ({ className = '', isMember, members, prime, proposals }: Props): React.ReactElement<Props> {
>>>>>>> ternoa-master
  return (
    <div className={className}>
      <Summary
        isMember={isMember}
        members={members}
<<<<<<< HEAD
        proposalHashes={proposalHashes}
        type={type}
=======
        proposals={proposals}
>>>>>>> ternoa-master
      />
      <Members
        members={members}
        prime={prime}
      />
    </div>
  );
}

export default React.memo(Overview);
