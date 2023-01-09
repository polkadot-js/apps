// Copyright 2017-2023 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { AddressSmall, Table, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

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
      empty={members && t<string>('No members found')}
      header={headerRef.current}
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
