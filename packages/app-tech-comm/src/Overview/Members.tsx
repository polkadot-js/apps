// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressSmall, Table } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps {
  members?: AccountId[];
  className?: string;
}

function Members ({ className, members, t }: Props): React.ReactElement<Props> {
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

export default translate(Members);
