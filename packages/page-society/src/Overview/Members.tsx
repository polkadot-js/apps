// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Member from './Member';

interface Props {
  className?: string;
  info?: DeriveSociety;
}

function Members ({ className = '', info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members);

  const headerRef = useRef([
    [t('members'), 'start', 3],
    [t('strikes')],
    []
  ]);

  const filtered = useMemo(
    () => members && info
      ? members
        .filter((member) => !info.hasDefender || !member.accountId.eq(info.defender))
        .sort((a, b) =>
          !info.head?.eq(a.accountId)
            ? 1
            : !info.head?.eq(b.accountId)
              ? -1
              : 0
        )
      : undefined,
    [info, members]
  );

  return (
    <Table
      className={className}
      empty={info && filtered && t<string>('No active members')}
      header={headerRef.current}
    >
      {info && filtered && filtered.map((member): React.ReactNode => (
        <Member
          isHead={info.head?.eq(member.accountId)}
          key={member.accountId.toString()}
          value={member}
        />
      ))}
    </Table>
  );
}

export default React.memo(Members);
