// Copyright 2017-2021 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { AddressSmall, Table, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: string[];
  prime?: AccountId | null;
}

function Members ({ className = '', members, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('members'), 'start', 3]
  ]);

  return (
    <Table
      className={className}
      empty={members && t<string>('No members found')}
      header={headerRef.current}
    >
      {members?.map((accountId): React.ReactNode => (
        <tr key={accountId.toString()}>
          <td className='address'>
            <AddressSmall value={accountId} />
          </td>
          <td>
            {prime?.eq(accountId) && (
              <Tag
                color='green'
                hover={t<string>('Committee prime member, default voting')}
                label={t<string>('prime member')}
              />
            )}
          </td>
          <td className='all'>&nbsp;</td>
        </tr>
      ))}
    </Table>
  );
}

export default React.memo(Members);
