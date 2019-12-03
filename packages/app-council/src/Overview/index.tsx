// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedElectionsInfo } from '@polkadot/api-derive/types';
import { AccountId, BlockNumber } from '@polkadot/types/interfaces';

import React from 'react';
import { useLocation } from 'react-router-dom';
import { registry } from '@polkadot/react-api';
import { Button } from '@polkadot/react-components';
import { useApi, trackStream } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import Candidates from './Candidates';
import Members from './Members';
import SubmitCandidacy from './SubmitCandidacy';
import Summary from './Summary';
import Vote from './Vote';

interface Props {
  className?: string;
}

const NULL_INFO: DerivedElectionsInfo = {
  candidates: [],
  candidateCount: createType(registry, 'u32'),
  desiredSeats: createType(registry, 'u32'),
  members: [],
  runnersUp: [],
  termDuration: createType(registry, 'BlockNumber')
};

export default function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = trackStream<BlockNumber>(api.derive.chain.bestNumber, []);
  const _electionsInfo = trackStream<DerivedElectionsInfo>(api.derive.elections.info, []);
  const allVotes = trackStream<Record<string, AccountId[]>>(api.query.electionsPhragmen?.votesOf, [], {
    transform: ([voters, casted]: [AccountId[], AccountId[][]]): Record<string, AccountId[]> =>
      voters.reduce((result: Record<string, AccountId[]>, voter, index): Record<string, AccountId[]> => {
        casted[index].forEach((candidate): void => {
          const address = candidate.toString();

          if (!result[address]) {
            result[address] = [];
          }

          result[address].push(voter);
        });

        return result;
      }, {})
  });
  const { pathname } = useLocation();
  const electionsInfo = _electionsInfo || NULL_INFO;

  return (
    <div className={className}>
      {pathname === '/council' && (
        <>
          <Summary
            bestNumber={bestNumber}
            electionsInfo={electionsInfo}
          />
          <Button.Group>
            <SubmitCandidacy electionsInfo={electionsInfo} />
            <Button.Or />
            <Vote electionsInfo={electionsInfo} />
          </Button.Group>
        </>
      )}
      <Members
        allVotes={allVotes}
        className={pathname === '/council' ? '' : 'council--hidden'}
        electionsInfo={electionsInfo}
      />
      <Candidates
        allVotes={allVotes}
        className={pathname === '/council' ? 'council--hidden' : ''}
        electionsInfo={electionsInfo}
      />
    </div>
  );
}
