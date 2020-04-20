// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveCollectiveProposals, DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { BlockNumber, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useApi, useCall, useMembers } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Motion from './Motion';
import ProposeMotion from './ProposeMotion';
import ProposeExternal from './ProposeExternal';
import Slashing from './Slashing';

interface Props {
  className?: string;
  motions?: DeriveCollectiveProposals;
  prime: AccountId | null;
}

function Proposals ({ className, motions, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const { isMember, members } = useMembers();
  const filtered = bestNumber && motions?.filter(({ votes }) => votes?.end.gt(bestNumber));

  return (
    <div className={className}>
      <Button.Group>
        <ProposeMotion
          isMember={isMember}
          members={members}
        />
        <Button.Or />
        <ProposeExternal
          isMember={isMember}
          members={members}
        />
        <Button.Or />
        <Slashing
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      <Table
        empty={filtered && t('No council motions')}
        header={[
          [t('motions'), 'start', 2],
          [t('threshold')],
          [t('voting end')],
          [t('aye'), 'address'],
          [t('nay'), 'address'],
          [undefined, undefined, 2]
        ]}
      >
        {filtered?.map((motion: DeriveCollectiveProposal): React.ReactNode => (
          <Motion
            isMember={isMember}
            key={motion.hash.toHex()}
            members={members}
            motion={motion}
            prime={prime}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Proposals);
