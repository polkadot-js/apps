// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BountyIndex, BountyStatus } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import { Menu, Popup } from '@polkadot/react-components';
import { useCollectiveMembers, useToggle } from '@polkadot/react-hooks';

import { determineUnassignCuratorAction } from '../helpers/index.js';
import { useBountyStatus, useUserRole } from '../hooks/index.js';
import { useTranslation } from '../translate.js';
import { ValidUnassignCuratorAction } from '../types.js';
import BountyRejectCurator from './BountyRejectCurator.js';
import CloseBounty from './CloseBounty.js';
import ExtendBountyExpiryAction from './ExtendBountyExpiryAction.js';
import GiveUp from './GiveUp.js';
import SlashCurator from './SlashCurator.js';

interface Props {
  bestNumber: BN;
  className?: string;
  description: string;
  index: BountyIndex;
  proposals?: DeriveCollectiveProposal[];
  status: BountyStatus;
}

function Index ({ bestNumber, className, description, index, proposals, status }: Props): React.ReactElement<Props> | null {
  const [isCloseBountyOpen, toggleCloseBounty] = useToggle();
  const [isRejectCuratorOpen, toggleRejectCurator] = useToggle();
  const [isSlashCuratorOpen, toggleSlashCurator] = useToggle();
  const [isExtendExpiryOpen, toggleExtendExpiry] = useToggle();
  const [isGiveUpCuratorOpen, toggleGiveUpCurator] = useToggle();
  const [selectedAction, setSlashAction] = useState<ValidUnassignCuratorAction>();
  const { t } = useTranslation();
  const { isMember } = useCollectiveMembers('council');
  const { curator, updateDue } = useBountyStatus(status);
  const { isCurator, roles } = useUserRole(curator);

  const blocksUntilUpdate = useMemo(() => updateDue?.sub(bestNumber), [bestNumber, updateDue]);
  const availableSlashActions = determineUnassignCuratorAction(roles, status, blocksUntilUpdate);

  const slashCuratorActionNames = useRef<Record<ValidUnassignCuratorAction, string>>({
    SlashCuratorAction: t<string>('Slash curator'),
    SlashCuratorMotion: t<string>('Slash curator (Council)'),
    UnassignCurator: t<string>('Unassign curator')
  });

  const existingCloseBountyProposal = useMemo(
    () => proposals?.find(({ proposal }) =>
      proposal && proposal.method === 'closeBounty'
    ),
    [proposals]
  );

  const existingUnassignCuratorProposal = useMemo(
    () => proposals?.find(({ proposal }) =>
      proposal && proposal.method === 'unassignCurator'
    ),
    [proposals]
  );

  const showCloseBounty = (status.isFunded || status.isActive || status.isCuratorProposed) && isMember && !existingCloseBountyProposal;
  const showRejectCurator = status.isCuratorProposed && isCurator;
  const showGiveUpCurator = status.isActive && isCurator;
  const showExtendExpiry = status.isActive && isCurator;
  const showSlashCurator = (status.isCuratorProposed || status.isActive || status.isPendingPayout) && !existingUnassignCuratorProposal && availableSlashActions.length !== 0;

  const hasNoItems = !(showCloseBounty || showRejectCurator || showExtendExpiry || showSlashCurator || showGiveUpCurator);

  const slashCurator = useCallback(
    (actionName: ValidUnassignCuratorAction) =>
      (): void => {
        setSlashAction(actionName);
        toggleSlashCurator();
      },
    [toggleSlashCurator]
  );

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
          value={
            <Menu className='settings-menu'>
              {showCloseBounty && (
                <Menu.Item
                  key='closeBounty'
                  label={t<string>('Close')}
                  onClick={toggleCloseBounty}
                />
              )}
              {showRejectCurator && (
                <Menu.Item
                  key='rejectCurator'
                  label={t<string>('Reject curator')}
                  onClick={toggleRejectCurator}
                />
              )}
              {showExtendExpiry && (
                <Menu.Item
                  key='extendExpiry'
                  label={t<string>('Extend expiry')}
                  onClick={toggleExtendExpiry}
                />
              )}
              {showGiveUpCurator && (
                <Menu.Item
                  key='giveUpCurator'
                  label={t<string>('Give up')}
                  onClick={toggleGiveUpCurator}
                />
              )}
              {showSlashCurator && availableSlashActions.map((actionName) => (
                <Menu.Item
                  key={actionName}
                  label={slashCuratorActionNames.current[actionName]}
                  onClick={slashCurator(actionName)}
                />
              ))}
            </Menu>
          }
        />
      </div>
    )
    : null;
}

export default React.memo(Index);
