// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposals } from '@polkadot/api-derive/types';
import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { Button } from '@polkadot/react-components';
import { useApi, useCall, useIncrement, useMembers, useIsMountedRef } from '@polkadot/react-hooks';

import ProposalCreate from './ProposalCreate';
import Proposals from './Proposals';
import Summary from './Summary';
import TipCreate from './TipCreate';
import Tips from './Tips';

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const info = useCall<DeriveTreasuryProposals>(api.derive.treasury.proposals, []);
  const { isMember, members } = useMembers();

  const mountedRef = useIsMountedRef();
  const [hashTrigger, triggerHashes] = useIncrement();
  const [hashes, setHashes] = useState<string[] | null>(null);

  useEffect((): void => {
    if (hashTrigger && mountedRef.current) {
      api.query.treasury.tips.keys().then((keys) =>
        mountedRef.current && setHashes(
          keys.map((key) => key.args[0].toHex())
        )
      );
    }
  }, [api, hashTrigger, mountedRef]);

  return (
    <div className={className}>
      <Summary
        approvalCount={info?.approvals.length}
        proposalCount={info?.proposals.length}
      />
      <Button.Group>
        <ProposalCreate />
        <TipCreate
          members={members}
          refresh={triggerHashes}
        />
      </Button.Group>
      <Proposals
        isMember={isMember}
        members={members}
        proposals={info?.proposals}
      />
      <Proposals
        isApprovals
        isMember={isMember}
        members={members}
        proposals={info?.approvals}
      />
      <Tips
        hashes={hashes}
        isMember={isMember}
        members={members}
      />
    </div>
  );
}

export default React.memo(Overview);
