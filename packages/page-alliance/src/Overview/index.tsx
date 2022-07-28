// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Member as MemberType, Rule, Unscrupelous } from '../types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Join from './Join';
import Members from './Members';
import Summary from './Summary';

interface Props {
  className?: string;
  isVoter?: boolean;
  members?: MemberType[];
  rule?: Rule;
  unscrupelous?: Unscrupelous;
  voters?: string[];
}

function Overview ({ className, members, rule, unscrupelous }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isJoinOpen, toggleJoin] = useToggle();

  return (
    <div className={className}>
      <Summary
        members={members}
        rule={rule}
      />
      <Button.Group>
        <Button
          icon='add'
          isDisabled={!members || !unscrupelous}
          label={t<string>('Join')}
          onClick={toggleJoin}
        />
        {members && unscrupelous && isJoinOpen && (
          <Join
            members={members}
            onClose={toggleJoin}
            unscrupelous={unscrupelous}
          />
        )}
      </Button.Group>
      <Members members={members} />
    </div>
  );
}

export default React.memo(Overview);
