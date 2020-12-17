// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import AddBountyModal from '@polkadot/app-bounties/AddBountyModal';
import { Button, Table } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import Bounty from './Bounty';
import { useTranslation } from './translate';

interface Props {
  className: string;
}

function Bounties ({ className = '' }: Props): React.ReactElement {
  const { t } = useTranslation();
  const { api } = useApi();
  const [addBountyModal, toggleAddBountyModal] = useToggle();

  const deriveBounties = useCall<DeriveBounties>(api.derive.treasury.bounties);

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
    []
  ]);

  console.log(addBountyModal);

  return (
    <div className={className}>
      {addBountyModal && (
        <AddBountyModal
          onClose={toggleAddBountyModal}
        />
      )}
      <div className='bountiesHeader'>
        <Button
          icon='plus'
          isDisabled={false}
          label={t<string>('Add Bounty')}
          onClick={toggleAddBountyModal}
        />
      </div>
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
    </div>
  );
}

export default React.memo(styled(Bounties)`
  .bountiesHeader {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin: 1rem 0;
  }
`
);
