// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { BountyExtraActions } from '@polkadot/app-bounties/BountyExtraActions';
import { Button, Menu, Popup } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';
import { AccountId, BountyStatus } from '@polkadot/types/interfaces';

interface Props {
  curator?: AccountId;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
  toggleCloseBounty: () => void;
  toggleExtendExpiry: () => void;
  toggleRejectCurator: () => void;
}

export function ExtraActionsButton ({ curator, proposals, status, toggleCloseBounty, toggleExtendExpiry, toggleRejectCurator }: Props): React.ReactElement<Props> {
  const [isOpen, toggleOpen] = useToggle();

  return (
    <Popup
      isOpen={isOpen}
      onClose={toggleOpen}
      trigger={
        <Button
          className='settings-button'
          dataTestId='extra-actions'
          icon='ellipsis-v'
          onClick={toggleOpen}
        />
      }
    >
      <Menu
        className='settings-menu'
        onClick={toggleOpen}
        text
        vertical
      >
        <BountyExtraActions
          curator={curator}
          proposals={proposals}
          status={status}
          toggleCloseBounty={toggleCloseBounty}
          toggleExtendExpiry={toggleExtendExpiry}
          toggleRejectCurator={toggleRejectCurator}
        />
      </Menu>
    </Popup>
  );
}
