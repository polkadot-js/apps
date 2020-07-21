// Copyright 2017-2020 @polkadot/app-society authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSociety } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { Button } from '@polkadot/react-components';
import { useApi, useCall, useToggle } from '@polkadot/react-hooks';

import useMembers from '../useMembers';
import BidNew from './BidNew';
import Bids from './Bids';
import Candidates from './Candidates';
import Defender from './Defender';
import Members from './Members';
import Summary from './Summary';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const info = useCall<DeriveSociety>(api.derive.society.info, []);
  const { allMembers, isMember, ownMembers } = useMembers();
  const [isBidOpen, toggleBidOpen] = useToggle();

  return (
    <div className={className}>
      <Summary info={info} />
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
      <Defender
        info={info}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Members info={info} />
      <Candidates
        allMembers={allMembers}
        isMember={isMember}
        ownMembers={ownMembers}
      />
      <Bids />
    </div>
  );
}

export default React.memo(styled(Overview)`
  .overviewSection {
    margin-bottom: 1.5rem;
  }
`);
