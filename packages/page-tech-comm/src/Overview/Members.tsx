// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { AddressSmall, Badge, Icon, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  members: string[];
  prime?: AccountId | null;
}

function Members ({ className, members, prime }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {members.length
        ? (
          <Table>
            <Table.Body>
              {members.map((accountId): React.ReactNode => {
                const isPrime = prime?.toString() === accountId.toString();

                return (
                  <tr
                    className={isPrime ? 'techcomm--isPrime' : ''}
                    key={accountId.toString()}
                  >
                    <td className='all top padtop'>
                      <AddressSmall value={accountId} />
                    </td>
                    <td className='right techcomm--prime'>
                      {isPrime && (
                        <div>
                          <Badge
                            info={<Icon name='chess king' />}
                            isInline
                            type='green'
                          />
                          <span>{' '}{t('prime voter')}</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </Table.Body>
          </Table>
        )
        : t('No members found')
      }
    </div>
  );
}

export default React.memo(styled(Members)`
  .techcomm--isPrime td {
    background: rgba(239, 255, 239, 0.8);
  }
  .techcomm--prime > div {
    display: inline-flex;
    align-items: center;
    white-space: nowrap;

    > span {
      color: green;
    }
  }
`);
