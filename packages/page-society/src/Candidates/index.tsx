// Copyright 2017-2021 @polkadot/app-society authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import BidNew from './BidNew';
import Bids from './Bids';
import AllCandidates from './Candidates';

interface Props {
  allMembers: string[];
  className?: string;
  isMember: boolean;
  ownMembers: string[];
}

function Candidates ({ allMembers, className, isMember, ownMembers }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [isBidOpen, toggleBidOpen] = useToggle();

  return (
    <div className={className}>
      <Button.Group>
        <Button
          icon='plus'
          label={t<string>('Submit bid')}
          onClick={toggleBidOpen}
        />
        {isBidOpen && (
          <BidNew onClose={toggleBidOpen} />
        )}
      </Button.Group>
      <AllCandidates
        allMembers={allMembers}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Bids />
    </div>
  );
}

export default React.memo(Candidates);
