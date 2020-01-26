// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';
import { CollectiveProps } from './types';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';

import Propose from './Propose';
import Proposal from './Proposal';
import Slashing from './Slashing';

interface Props extends CollectiveProps {
  header: React.ReactNode;
  placeholder: React.ReactNode;
  proposePrompt: React.ReactNode;
  thresholdHelp: React.ReactNode;
}

export default function Proposals ({ className, collective, header, isMember, members, placeholder, proposals, proposePrompt, thresholdHelp }: Props): React.ReactElement<Props> {
  const isCouncil = collective === 'council';

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          collective={collective}
          isMember={isMember}
          members={members}
          prompt={proposePrompt}
          thresholdHelp={thresholdHelp}
        />
        {isCouncil && (
          <>
            <Button.Or />
            <Slashing
              collective={collective}
              isMember={isMember}
              members={members}
            />
          </>
        )}
      </Button.Group>
      <h1>
        {header}
      </h1>
      {proposals?.length
        ? (
          <Table>
            <Table.Body>
              {proposals?.map((proposal: DerivedCollectiveProposal): React.ReactNode => (
                <Proposal
                  collective={collective}
                  isMember={isMember}
                  key={proposal.hash.toHex()}
                  members={members}
                  proposal={proposal}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : placeholder
      }
    </div>
  );
}
