// Copyright 2017-2025 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveSocietyCandidate } from '@polkadot/api-derive/types';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import BidNew from './BidNew.js';
import Bids from './Bids.js';
import AllCandidates from './Candidates.js';
import VouchFor from './VouchFor.js';

interface Props {
  allMembers: string[];
  candidates?: DeriveSocietyCandidate[];
  className?: string;
  isMember: boolean;
  ownMembers: string[];
}

function Candidates ({ allMembers, candidates, className, isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBidOpen, toggleBidOpen] = useToggle();
  const [isVouchOpen, toggleVouchOpen] = useToggle();

  return (
    <div className={className}>
      <Button.Group>
        <Button
          icon='plus'
          label={t('Submit bid')}
          onClick={toggleBidOpen}
        />
        <Button
          icon='plus'
          isDisabled={!isMember}
          label={t('Vouch for')}
          onClick={toggleVouchOpen}
        />
        {isBidOpen && (
          <BidNew onClose={toggleBidOpen} />
        )}
        {isVouchOpen && (
          <VouchFor
            allMembers={allMembers}
            onClose={toggleVouchOpen}
          />
        )}
      </Button.Group>
      <AllCandidates
        allMembers={allMembers}
        candidates={candidates}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Bids />
    </div>
  );
}

export default React.memo(Candidates);
