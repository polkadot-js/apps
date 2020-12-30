// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCouncilVotes, DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { AccountId, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import {useApi, useCall, useMembers} from '@polkadot/react-hooks';

import Candidates from './Candidates';
import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
// import Summary from './Summary';
import Vote from './Vote';

import SimpleSummary from './SimpleSummary';
import SimpleMembers from './SimpleMembers';

interface Props {
  className?: string;
  prime: AccountId | null;
}

const transformVotes = {
  transform: (entries: DeriveCouncilVotes): Record<string, AccountId[]> => {
    return entries.reduce((result: Record<string, AccountId[]>, [voter, { votes }]): Record<string, AccountId[]> => {
      votes.forEach((candidate): void => {
        const address = candidate.toString();

        if (!result[address]) {
          result[address] = [];
        }

        result[address].push(voter);
      });

      return result;
    }, {});
  }
};

function Overview ({ className = '', prime }: Props): React.ReactElement<Props> {
  // SD: Commented lines below
  // const { api } = useApi();
  // const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  // const electionsInfo = useCall<DeriveElectionsInfo>(api.derive.elections.info);
  // const allVotes = useCall<Record<string, AccountId[]>>(api.derive.council.votes, undefined, transformVotes);

  const { isMember, members } = useMembers('council');

  return (
    <div className={className}>
      <SimpleSummary
        members={members}
      />
      <SimpleMembers
        members={members}
        prime={prime}
      />
      {/* SD: Commented components below */}
      {/*<Summary
        bestNumber={bestNumber}
        electionsInfo={electionsInfo}
      />
      <Button.Group>
        <Vote electionsInfo={electionsInfo} />
        <SubmitCandidacy electionsInfo={electionsInfo} />
      </Button.Group>
      <Members
        allVotes={allVotes}
        // electionsInfo={electionsInfo}
        prime={prime}
      />
      <Candidates
        allVotes={allVotes}
        electionsInfo={electionsInfo}
      />*/}
    </div>
  );
}

export default React.memo(Overview);
