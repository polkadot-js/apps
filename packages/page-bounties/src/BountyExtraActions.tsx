// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { Button, Menu, Popup } from '@polkadot/react-components';
import { ThemeProps } from '@polkadot/react-components/types';
import { useAccounts, useMembers, useToggle } from '@polkadot/react-hooks';
import { AccountId, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import BountyRejectCurator from './BountyRejectCurator';
import CloseBounty from './CloseBounty';
import ExtendBountyExpiryAction from './ExtendBountyExpiryAction';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  curator?: AccountId;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function BountyExtraActions ({ className, curator, description, index, proposals, status }: Props): React.ReactElement<Props> | null {
  const [isPopupOpen, togglePopupOpen] = useToggle();
  const [isCloseBountyOpen, toggleCloseBounty] = useToggle();
  const [isRejectCuratorOpen, toggleRejectCurator] = useToggle();
  const [isExtendExpiryOpen, toggleExtendExpiry] = useToggle();

  const { t } = useTranslation();
  const { isMember } = useMembers();
  const { allAccounts } = useAccounts();

  const existingCloseBountyProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'closeBounty'), [proposals]);
  const isCurator = useMemo(() => curator && allAccounts.includes(curator.toString()), [allAccounts, curator]);

  const showCloseBounty = (status.isFunded || status.isActive || status.isCuratorProposed) && isMember && !existingCloseBountyProposal;
  const showRejectCurator = status.isCuratorProposed && isCurator;
  const showExtendExpiry = status.isActive && isCurator;

  const hasNoItems = !(showCloseBounty || showRejectCurator || showExtendExpiry);

  return !hasNoItems
    ? (
      <div className={className}>
        {isCloseBountyOpen &&
          <CloseBounty
            index={index}
            toggleOpen={toggleCloseBounty}
          />
        }
        {isRejectCuratorOpen && curator &&
          <BountyRejectCurator
            curatorId={curator}
            index={index}
            toggleOpen={toggleRejectCurator}
          />
        }
        {isExtendExpiryOpen && curator &&
          <ExtendBountyExpiryAction
            curatorId={curator}
            description={description}
            index={index}
            toggleOpen={toggleExtendExpiry}
          />
        }
        <Popup
          isOpen={isPopupOpen}
          onClose={togglePopupOpen}
          trigger={
            <Button
              className='settings-button'
              dataTestId='extra-actions'
              icon='ellipsis-v'
              onClick={togglePopupOpen}
            />
          }
        >
          <Menu
            className='settings-menu'
            onClick={togglePopupOpen}
            text
            vertical
          >
            {showCloseBounty &&
              <Menu.Item
                key='closeBounty'
                onClick={toggleCloseBounty}
              >
                {t<string>('Close')}
              </Menu.Item>
            }
            {showRejectCurator &&
              <Menu.Item
                key='rejectCurator'
                onClick={toggleRejectCurator}
              >
                {t<string>('Reject Curator')}
              </Menu.Item>
            }
            {showExtendExpiry &&
              <Menu.Item
                key='extendExpiry'
                onClick={toggleExtendExpiry}
              >
                {t<string>('Extend Expiry')}
              </Menu.Item>
            }
          </Menu>
        </Popup>
      </div>
    )
    : null;
}

export default React.memo(styled(BountyExtraActions)(({ theme }: ThemeProps) => `
  .settings-button {
    width: 24px;
    height: 24px;
    padding: 0;
    border-radius: 4px;

    svg {
      padding: 0;
      margin: 0;
      color: ${theme.theme === 'dark' ? 'rgba(244,242,240,0.9)' : '#000 !important'};
    }

    &:focus {
      border: 1px solid #616161;
    }
  }
`));
