// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash } from '@polkadot/types/interfaces';

import React from 'react';

import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
  members?: AccountId[];
  proposals?: Hash[];
}

export default function Overview ({ className, members, proposals }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary
        members={members}
        proposals={proposals}
      />
      {/* <Button.Group>
        <SubmitCandidacy electionsInfo={electionsInfo} />
        <Button.Or />
        <Vote electionsInfo={electionsInfo} />
      </Button.Group> */}
      <Members members={members} />
    </div>
  );
}
