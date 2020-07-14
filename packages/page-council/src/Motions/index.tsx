// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveCollectiveProposals, DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useMembers } from '@polkadot/react-hooks';

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

function Proposals ({ className = '', motions, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isMember, members } = useMembers();

  const header = useMemo(() => [
    [t('motions'), 'start', 2],
    [t('threshold')],
    [t('voting end')],
    [undefined, 'address'],
    [undefined, 'address'],
    [],
    [undefined, 'badge'],
    [undefined, 'mini']
  ], [t]);

  return (
    <div className={className}>
      <Button.Group>
        <ProposeMotion
          isMember={isMember}
          members={members}
        />
        <ProposeExternal
          isMember={isMember}
          members={members}
        />
        <Slashing
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      <Table
        empty={motions && t<string>('No council motions')}
        header={header}
      >
        {motions?.map((motion: DeriveCollectiveProposal): React.ReactNode => (
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
