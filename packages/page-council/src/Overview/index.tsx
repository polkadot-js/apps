// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCouncilVotes, DeriveElectionsInfo } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

import { useModuleElections } from '../useModuleElections';
import Candidates from './Candidates';
import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

interface Props {
  className?: string;
  prime?: AccountId | null;
}

const transformVotes = {
  transform: (entries: DeriveCouncilVotes): Record<string, AccountId[]> =>
    entries.reduce<Record<string, AccountId[]>>((result, [voter, { votes }]) => {
      votes.forEach((candidate): void => {
        const address = candidate.toString();

        if (!result[address]) {
          result[address] = [];
        }

        result[address].push(voter);
      });

      return result;
    }, {})
};

function Overview ({ className = '', prime }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useBestNumber();
  const electionsInfo = useCall<DeriveElectionsInfo>(api.derive.elections.info);
  const allVotes = useCall<Record<string, AccountId[]>>(api.derive.council.votes, undefined, transformVotes);
  const modElections = useModuleElections();
  const hasElections = !!modElections;

  return (
    <div className={className}>
      <Summary
        bestNumber={bestNumber}
        electionsInfo={electionsInfo}
        hasElections={!!modElections}
      />
      {hasElections && (
        <Button.Group>
          <Vote electionsInfo={electionsInfo} />
          <SubmitCandidacy electionsInfo={electionsInfo} />
        </Button.Group>
      )}
      <Members
        allVotes={allVotes}
        electionsInfo={electionsInfo}
        hasElections={hasElections}
        prime={prime}
      />
      {hasElections && (
        <Candidates
          allVotes={allVotes}
          electionsInfo={electionsInfo}
        />
      )}
    </div>
  );
}

export default React.memo(Overview);
