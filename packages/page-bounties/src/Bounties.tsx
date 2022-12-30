// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef } from 'react';
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

function Bounties ({ className }: Props): React.ReactElement {
  const { t } = useTranslation();
  const info = useBounties();

  const sorted = useMemo(
    () => info && info.bounties && [...info.bounties].sort((a, b) => b.index.cmp(a.index)),
    [info]
  );

  const headerRef = useRef([
    [t('bounties'), 'start', 3],
    [t('value'), 'start'],
    [t('curator'), 'start'],
    [t('next action'), 'start', 3]
  ]);

  return (
    <div className={className}>
      <Summary info={info} />
      <Button.Group>
        <BountyCreate />
      </Button.Group>
      <Table
        className='bounties-table-wrapper'
        empty={sorted && t<string>('No open bounties')}
        header={headerRef.current}
      >
        {sorted && info.bestNumber && sorted.map(({ bounty, description, index, proposals }) => (
          <Bounty
            bestNumber={info.bestNumber}
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
    tr {
      td, &:not(.filter) th {
        &:last-child {
          padding-right: 1.14rem;
        }
      }
    }
  }

  .ui--IdentityIcon {
    margin-right: 0.42rem;
  }

  .via-identity .name {
    font-size: 1rem;
    line-height: 1.7rem;
    text-transform: initial;
    filter: initial;
    opacity: 1;
  }
`);
