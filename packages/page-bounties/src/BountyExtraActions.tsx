// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId, BountyStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import { useTranslation } from '@polkadot/app-bounties/translate';
import { Menu } from '@polkadot/react-components';
import { useAccounts, useMembers } from '@polkadot/react-hooks';

interface Props {
  curator?: AccountId;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
  toggleCloseBounty: () => void;
  toggleExtendExpiry: () => void;
  toggleRejectCurator: () => void;
}

export function BountyExtraActions ({ curator, proposals, status, toggleCloseBounty, toggleExtendExpiry, toggleRejectCurator }: Props): JSX.Element {
  const { t } = useTranslation();
  const { isMember } = useMembers();
  const { allAccounts } = useAccounts();

  const existingCloseBountyProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'closeBounty'), [proposals]);
  const isCurator = useMemo(() => curator && allAccounts.includes(curator.toString()), [allAccounts, curator]);

  const isCloseBounty = (status.isFunded || status.isActive || status.isCuratorProposed) && isMember && !existingCloseBountyProposal;
  const isRejectCurator = status.isCuratorProposed && isCurator;
  const isExtendExpiry = status.isActive && isCurator;

  const isNoItems = !(isCloseBounty || isRejectCurator || isExtendExpiry);

  return (
    <>
      {isCloseBounty &&
        <Menu.Item
          key='closeBounty'
          onClick={toggleCloseBounty}
        >
          {t<string>('Close')}
        </Menu.Item>
      }
      {isRejectCurator &&
        <Menu.Item
          key='rejectCurator'
          onClick={toggleRejectCurator}
        >
          {t<string>('Reject Curator')}
        </Menu.Item>
      }
      {isExtendExpiry &&
        <Menu.Item
          key='extendExpiry'
          onClick={toggleExtendExpiry}
        >
          {t<string>('Extend Expiry')}
        </Menu.Item>
      }
      {isNoItems &&
        <Menu.Item
          key='default'
        >
          {'-'}
        </Menu.Item>
      }
    </>
  );
}
