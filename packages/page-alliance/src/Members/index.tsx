// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType, Rule, Unscrupulous } from '../types.js';

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';
import { useBestNumber, useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import Join from './Join.js';
import Member from './Member.js';
import Summary from './Summary.js';

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
  const bestNumber = useBestNumber();

  const hdrRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('members'), 'start', 3]
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
          label={t('Join')}
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
        empty={members && t('No members')}
        header={hdrRef.current}
        isSplit
        maxColumns={2}
      >
        {members?.map((m) => (
          <Member
            bestNumber={bestNumber}
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
