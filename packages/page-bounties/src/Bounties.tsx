// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';

import Bounty from './Bounty';
import BountyCreate from './BountyCreate';
import { useBounties } from './hooks';
import { useTranslation } from './translate';

function Bounties (): React.ReactElement {
  const { t } = useTranslation();
  const { bestNumber, bounties } = useBounties();

  const headerRef = useRef([
    [t('bounties'), 'start'],
    [t('title'), 'start'],
    [t('value'), 'start'],
    [t('curator'), 'start'],
    [t('update due'), 'start'],
    [t('beneficiary'), 'start'],
    [t('payout due'), 'start'],
    [],
    [],
    []
  ]);

  return (
    <>
      <Button.Group>
        <BountyCreate />
      </Button.Group>
      <Table
        empty={bounties && t<string>('No open bounties')}
        header={headerRef.current}
      >
        {bounties && bestNumber && bounties.map(({ bounty, description, index }) => (
          <Bounty
            bestNumber={bestNumber}
            bounty={bounty}
            description={description}
            index={index}
            key={index.toNumber()}
          />
        ))}
      </Table>
    </>
  );
}

export default React.memo(Bounties);
