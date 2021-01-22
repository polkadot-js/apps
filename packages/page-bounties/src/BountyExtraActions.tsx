// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { Balance, BlockNumber, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { useTranslation } from '@polkadot/app-bounties/translate';
import { Menu } from '@polkadot/react-components';
import { useMembers } from '@polkadot/react-hooks';

interface Props {
  bestNumber: BlockNumber;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
  toggleCloseBounty: () => void;
  value: Balance;
}

export function BountyExtraActions ({ bestNumber, description, index, proposals, status, toggleCloseBounty, value }: Props): JSX.Element {
  const { t } = useTranslation();
  const { isMember } = useMembers();

  const existingCloseBountyProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'closeBounty'), [proposals]);

  return (
    <>
      {
        (status.isFunded || status.isActive || status.isCuratorProposed) && isMember && !existingCloseBountyProposal &&
        <Menu.Item
          key='closeBounty'
          onClick={toggleCloseBounty}
        >
          {t<string>('Close')}
        </Menu.Item>
      }
    </>
  );
}
