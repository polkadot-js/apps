// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Join from './Join';
import Member from './Member';
import Summary from './Summary';
import { useTranslation } from './translate';
import useMembers from './useMembers';

interface Props {
  className?: string;
}

function Members ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isJoinOpen, toggleJoin] = useToggle();
  const members = useMembers();

  const hdrRef = useRef([
    [t<string>('members'), 'start', 2],
    [t<string>('role'), 'number']
  ]);

  return (
    <div className={className}>
      <Summary />
      <Button.Group>
        <Button
          icon='add'
          isDisabled={!members}
          label={t<string>('Join')}
          onClick={toggleJoin}
        />
        {members && isJoinOpen && (
          <Join
            members={members}
            onClose={toggleJoin}
          />
        )}
      </Button.Group>
      <Table
        empty={members && t<string>('No members')}
        header={hdrRef.current}
      >
        {members && members.map((m) => (
          <Member
            info={m}
            key={m.accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Members);
