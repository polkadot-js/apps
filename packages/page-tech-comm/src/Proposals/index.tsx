// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Hash } from '@polkadot/types/interfaces';
import { ComponentProps as Props } from '../types';

import React from 'react';
import { Button, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Proposal from './Proposal';
import Propose from './Propose';

function Proposals ({ className, isMember, members, prime, proposals }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <Button.Group>
        <Propose
          isMember={isMember}
          members={members}
        />
      </Button.Group>
      <Table>
        <Table.Head>
          <th
            className='start'
            colSpan={2}
          >
            <h1>{t('proposals')}</h1>
          </th>
          <th>{t('threshold')}</th>
          <th className='address'>{t('aye')}</th>
          <th className='address'>{t('nay')}</th>
          <th>&nbsp;</th>
        </Table.Head>
        <Table.Body empty={proposals && t('No committee proposals')}>
          {proposals?.map((hash: Hash): React.ReactNode => (
            <Proposal
              imageHash={hash.toHex()}
              key={hash.toHex()}
              prime={prime}
            />
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}

export default React.memo(Proposals);
