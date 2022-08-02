// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType, Rule, Unscrupulous } from '../types';

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Join from './Join';
import Member from './Member';
import Summary from './Summary';

interface Props {
  className?: string;
  isVoter?: boolean;
  members?: MemberType[];
  prime?: string | null;
  rule?: Rule;
  unscrupulous?: Unscrupulous;
  voters?: string[];
}

function Overview ({ className, members, prime, rule, unscrupulous, voters }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isJoinOpen, toggleJoin] = useToggle();

  const hdrRef = useRef([
    [t<string>('members'), 'start', 2],
    [t<string>('deposit'), 'number'],
    [t<string>('role'), 'number'],
    []
  ]);

  return (
    <div className={className}>
      <Summary
        members={members}
        rule={rule}
      />
      <Button.Group>
        <Button
          icon='add'
          isDisabled={!members || !unscrupulous}
          label={t<string>('Join')}
          onClick={toggleJoin}
        />
        {members && unscrupulous && isJoinOpen && (
          <Join
            members={members}
            onClose={toggleJoin}
            unscrupulous={unscrupulous}
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
            isPrime={prime === m.accountId}
            isVoter={!!voters && voters.includes(m.accountId)}
            key={m.accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Overview);
