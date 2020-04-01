// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall, Table, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: string[];
  prime?: AccountId | null;
}

function Members ({ className, members, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <Table className={className}>
      <Table.Head>
        <th
          className='start'
          colSpan={3}
        >
          <h1>{t('members')}</h1>
        </th>
      </Table.Head>
      <Table.Body empty={members && t('No members found')}>
        {members?.map((accountId): React.ReactNode => (
          <tr key={accountId.toString()}>
            <td className='address'>
              <AddressSmall value={accountId} />
            </td>
            <td>
              {prime?.eq(accountId) && (
                <Tag
                  color='green'
                  hover={t('Committee prime member, default voting')}
                  label={t('prime member')}
                />
              )}
            </td>
            <td className='all'>&nbsp;</td>
          </tr>
        ))}
      </Table.Body>
    </Table>
  );
}

export default React.memo(Members);
