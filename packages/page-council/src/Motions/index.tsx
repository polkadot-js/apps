// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AccountId, Hash } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useMembers } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Motion from './Motion';
import ProposeMotion from './ProposeMotion';
import ProposeExternal from './ProposeExternal';
import Slashing from './Slashing';

interface Props {
  className?: string;
  hashes?: Hash[];
  prime: AccountId | null;
}

function Proposals ({ className = '', hashes, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { isMember, members } = useMembers();

  const headerRef = useRef([
    [t('motions'), 'start', 2],
    [t('threshold')],
    [t('voting end')],
    [t('votes'), 'expand'],
    [],
    [undefined, 'badge'],
    []
  ]);

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
        empty={hashes && t<string>('No council motions')}
        header={headerRef.current}
      >
        {hashes?.map((hash: Hash): React.ReactNode => (
          <Motion
            hash={hash}
            isMember={isMember}
            key={hash.toHex()}
            members={members}
            prime={prime}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Proposals);
