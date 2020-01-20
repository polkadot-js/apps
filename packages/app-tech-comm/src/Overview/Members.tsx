// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members?: AccountId[];
}

export default function Members ({ className, members }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {members?.length
        ? (
          <Table>
            <Table.Body>
              {members.map((accountId): React.ReactNode => (
                <tr key={accountId.toString()}>
                  <td>
                    <AddressSmall value={accountId} />
                  </td>
                </tr>
              ))}
            </Table.Body>
          </Table>
        )
        : t('No members found')
      }
    </div>
  );
}
