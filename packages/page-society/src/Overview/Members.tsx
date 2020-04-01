// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety, DeriveSocietyMember } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Member from './Member';

interface Props {
  className?: string;
  info?: DeriveSociety;
}

function Members ({ className, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members, []);
  const [filtered, setFiltered] = useState<DeriveSocietyMember[]>([]);

  useEffect((): void => {
    members && setFiltered(
      members.filter((member): boolean => !info || !info.hasDefender || !member.accountId.eq(info.defender))
    );
  }, [info, members]);

  return (
    <Table className={className}>
      <Table.Head>
        <th
          className='start'
          colSpan={3}
        >
          <h1>{t('members')}</h1>
        </th>
        <th>{t('strikes')}</th>
      </Table.Head>
      <Table.Body empty={info && t('No active members')}>
        {filtered.map((member): React.ReactNode => (
          <Member
            isHead={info?.head?.eq(member.accountId)}
            key={member.accountId.toString()}
            value={member}
          />
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Members);
