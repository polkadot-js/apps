// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { Button, Menu, Popup } from '@polkadot/react-components';
import { useMembers, useToggle } from '@polkadot/react-hooks';
import { BlockNumber, BountyIndex, BountyStatus } from '@polkadot/types/interfaces';

import { determineUnassignCuratorAction } from '../helpers';
import { useBountyStatus, useUserRole } from '../hooks';
import { useTranslation } from '../translate';
import { ValidUnassignCuratorAction } from '../types';
import BountyRejectCurator from './BountyRejectCurator';
import CloseBounty from './CloseBounty';
import ExtendBountyExpiryAction from './ExtendBountyExpiryAction';
import GiveUp from './GiveUp';
import SlashCurator from './SlashCurator';

interface Props {
  bestNumber: BlockNumber;
  className?: string;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function Index ({ bestNumber, className, description, index, proposals, status }: Props): React.ReactElement<Props> | null {
  const [isPopupOpen, togglePopupOpen] = useToggle();
  const [isCloseBountyOpen, toggleCloseBounty] = useToggle();
  const [isRejectCuratorOpen, toggleRejectCurator] = useToggle();
  const [isSlashCuratorOpen, toggleSlashCurator] = useToggle();
  const [isExtendExpiryOpen, toggleExtendExpiry] = useToggle();
  const [isGiveUpCuratorOpen, toggleGiveUpCurator] = useToggle();
  const [selectedAction, setSlashAction] = useState<ValidUnassignCuratorAction>();
  const { t } = useTranslation();
  const { isMember } = useMembers();
  const { curator, updateDue } = useBountyStatus(status);

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);

  const { isCurator, roles } = useUserRole(curator);
  const availableSlashActions = determineUnassignCuratorAction(roles, status, blocksUntilUpdate);

  const slashCuratorActionNames = useRef<Record<ValidUnassignCuratorAction, string>>({
    SlashCuratorAction: t('Slash curator'),
    SlashCuratorMotion: t('Slash curator (Council)'),
    UnassignCurator: t('Unassign curator')
  });

  const existingCloseBountyProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'closeBounty'), [proposals]);
  const existingUnassignCuratorProposal = useMemo(() => proposals?.find(({ proposal }) => proposal.method === 'unassignCurator'), [proposals]);

  const showCloseBounty = (status.isFunded || status.isActive || status.isCuratorProposed) && isMember && !existingCloseBountyProposal;
  const showRejectCurator = status.isCuratorProposed && isCurator;
  const showGiveUpCurator = status.isActive && isCurator;
  const showExtendExpiry = status.isActive && isCurator;
  const showSlashCurator = (status.isCuratorProposed || status.isActive || status.isPendingPayout) && !existingUnassignCuratorProposal && availableSlashActions.length !== 0;

  const hasNoItems = !(showCloseBounty || showRejectCurator || showExtendExpiry || showSlashCurator || showGiveUpCurator);

  function slashCuratorClicked (action: ValidUnassignCuratorAction) {
    setSlashAction(action);
    toggleSlashCurator();
  }

  return !hasNoItems
    ? (
      <div className={className}>
        {isCloseBountyOpen &&
          <CloseBounty
            description={description}
            index={index}
            toggleOpen={toggleCloseBounty}
          />
        }
        {isRejectCuratorOpen && curator &&
          <BountyRejectCurator
            curatorId={curator}
            description={description}
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
        {isGiveUpCuratorOpen && curator &&
          <GiveUp
            curatorId={curator}
            description={description}
            index={index}
            toggleOpen={toggleGiveUpCurator}
          />
        }
        {isSlashCuratorOpen && curator && selectedAction &&
          <SlashCurator
            action={selectedAction}
            curatorId={curator}
            description={description}
            index={index}
            toggleOpen={toggleSlashCurator}
          />
        }
        <Popup
          isOpen={isPopupOpen}
          onClose={togglePopupOpen}
          trigger={
            <Button
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
                {t<string>('Reject curator')}
              </Menu.Item>
            }
            {showExtendExpiry &&
              <Menu.Item
                key='extendExpiry'
                onClick={toggleExtendExpiry}
              >
                {t<string>('Extend expiry')}
              </Menu.Item>
            }
            {showGiveUpCurator &&
              <Menu.Item
                key='giveUpCurator'
                onClick={toggleGiveUpCurator}
              >
                {t<string>('Give up')}
              </Menu.Item>
            }
            {showSlashCurator && availableSlashActions.map((actionName) =>
              <Menu.Item
                key={actionName}
                onClick={() => slashCuratorClicked(actionName)}
              >
                {slashCuratorActionNames.current[actionName]}
              </Menu.Item>
            )}
          </Menu>
        </Popup>
      </div>
    )
    : null;
}

export default React.memo(Index);
