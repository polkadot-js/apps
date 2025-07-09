// Copyright 2017-2025 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { AddressSmall, Table, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';

interface Props {
  className?: string;
  members?: string[];
  prime?: string | null;
}

function Members ({ className = '', members, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('members'), 'start', 3]
  ]);

  return (
    <Table
      className={className}
      empty={members && t('No members found')}
      header={headerRef.current}
      isSplit
    >
      {members?.map((accountId): React.ReactNode => (
        <tr key={accountId}>
          <td className='address'>
            <AddressSmall value={accountId} />
          </td>
          <td>
            {prime === accountId && (
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
    </Table>
  );
}

export default React.memo(Members);
