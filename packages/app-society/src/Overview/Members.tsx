// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSocietyMember } from '@polkadot/api-derive/types';

import React from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Member from './Member';

interface Props {
  className?: string;
}

export default function Members ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const members = useCall<DeriveSocietyMember[]>(api.derive.society.members, []);

  return (
    <div className={`overviewSection ${className}`}>
      <h1>{t('members')}</h1>
      {members?.length
        ? (
          <Table>
            <Table.Body>
              {members.map((member): React.ReactNode => (
                <Member
                  key={member.accountId.toString()}
                  value={member}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No active members')
      }
    </div>
  );
}
