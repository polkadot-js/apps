// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useMemo, useRef } from 'react';

import Summary from '@polkadot/app-bounties/Summary';
import { Button, styled, Table } from '@polkadot/react-components';

import Bounty from './Bounty';
import BountyCreate from './BountyCreate';
import { useBounties } from './hooks';
import { useTranslation } from './translate.js';

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

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t<string>('bounties'), 'start', 3],
    [t<string>('value')],
    [t<string>('curator'), 'start'],
    [t<string>('next action'), 'start', 3]
  ]);

  return (
    <StyledDiv className={className}>
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
            bestNumber={info.bestNumber as BN}
            bounty={bounty}
            description={description}
            index={index}
            key={index.toNumber()}
            proposals={proposals}
          />
        ))}
      </Table>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
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
    font-size: var(--font-size-base);
    line-height: 1.7rem;
    text-transform: initial;
    filter: initial;
    opacity: 1;
  }
`;

export default React.memo(Bounties);
