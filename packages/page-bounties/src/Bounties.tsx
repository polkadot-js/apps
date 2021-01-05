// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Button, Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Bounty from './Bounty';
import BountyCreate from './BountyCreate';
import { useTranslation } from './translate';

function Bounties (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const deriveBounties = useCall<DeriveBounties>(api.derive.bounties.bounties);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

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
        empty={deriveBounties && t<string>('No open bounties')}
        header={headerRef.current}
      >
        {deriveBounties && bestNumber && deriveBounties.map(({ bounty, description, index }) => (
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
