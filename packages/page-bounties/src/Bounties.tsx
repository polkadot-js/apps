// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import Bounty from './Bounty';
import { useTranslation } from './translate';

function Bounties (): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();

  const deriveBounties = useCall<DeriveBounties>(api.derive.treasury.bounties);

  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);

  const headerRef = useRef([
    [t('bounties'), 'start'],
    [t('title'), 'start'],
    [],
    [t('value'), 'start'],
    [],
    [t('curator'), 'start'],
    [t('update due'), 'start'],
    [],
    []
  ]);

  return (
    <Table
      empty={deriveBounties && t<string>('No open bounties')}
      header={headerRef.current}
    >
      {deriveBounties && bestNumber && deriveBounties.map(({ bounty, description }, index) => (
        <Bounty
          bestNumber={bestNumber}
          bounty={bounty}
          description={description}
          index={index}
          key={index}
        />
      ))}
    </Table>
  );
}

export default React.memo(Bounties);
