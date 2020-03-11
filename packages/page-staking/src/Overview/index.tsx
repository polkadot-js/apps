// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { BlockAuthorsContext } from '@polkadot/react-query';

import CurrentList from './CurrentList';

interface Props extends BareProps {
  hasQueries: boolean;
  isVisible: boolean;
  recentlyOnline?: DerivedHeartbeats;
  next?: string[];
  setNominators: (nominators: string[]) => void;
  stakingOverview?: DerivedStakingOverview;
}

export default function Overview ({ hasQueries, isVisible, className, recentlyOnline, next, setNominators, stakingOverview }: Props): React.ReactElement<Props> {
  const { pathname } = useLocation();
  const { byAuthor, lastBlockAuthors } = useContext(BlockAuthorsContext);
  const isIntentions = pathname !== '/staking';

  return (
    <div className={`staking--Overview ${className} ${!isVisible && 'staking--hidden'}`}>
      <CurrentList
        authorsMap={byAuthor}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        isVisible={isVisible}
        lastAuthors={lastBlockAuthors}
        next={next}
        recentlyOnline={recentlyOnline}
        setNominators={setNominators}
        stakingOverview={stakingOverview}
      />
    </div>
  );
}
