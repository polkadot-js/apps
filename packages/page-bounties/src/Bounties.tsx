// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';
import styled from 'styled-components';

import Summary from '@polkadot/app-bounties/Summary';
import { Button, Table } from '@polkadot/react-components';

import Bounty from './Bounty';
import BountyCreate from './BountyCreate';
import { useBounties } from './hooks';
import { useTranslation } from './translate';

interface Props {
  className?: string;
}

function Bounties ({className}: Props): React.ReactElement {
  const { t } = useTranslation();
  const { bestNumber, bounties } = useBounties();

  const headerRef = useRef([
    [t('status'), 'start'],
    [t('title'), 'start'],
    [],
    [t('value'), 'start'],
    [t('curator'), 'start'],
    [t('next action'), 'start'],
    [],
    []
  ]);

  return (
    <div className={className}>
      <Summary activeBounties={bounties?.length}/>
      <Button.Group>
        <BountyCreate />
      </Button.Group>
      <Table
        className='bounties-table-wrapper'
        empty={bounties && t<string>('No open bounties')}
        header={headerRef.current}
      >
        {bounties && bestNumber &&
        bounties.sort((a, b) => b.index.cmp(a.index))
          .map(({ bounty, description, index, proposals }) => (
            <Bounty
              bestNumber={bestNumber}
              bounty={bounty}
              description={description}
              index={index}
              key={index.toNumber()}
              proposals={proposals}
            />
          ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Bounties)`
  .bounties-table-wrapper table {
    background: none;

    &::before {
      background: none;
    }
  }
`);
