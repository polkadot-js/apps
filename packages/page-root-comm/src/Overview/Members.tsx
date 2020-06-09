// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { AddressSmall, Table, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: string[];
  prime?: AccountId | null;
}

function Members ({ className = '', members, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const header = useMemo(() => [
    [t('members'), 'start', 3]
  ], [t]);

  return (
    <Table
      className={className}
      empty={members && t<string>('No members found')}
      header={header}
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
