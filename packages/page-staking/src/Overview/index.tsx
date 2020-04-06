// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import { BlockAuthorsContext } from '@polkadot/react-query';

import CurrentList from './CurrentList';

interface Props extends BareProps {
  hasQueries: boolean;
  isIntentions?: boolean;
  recentlyOnline?: DeriveHeartbeats;
  next?: string[];
  setNominators: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
}

function Overview ({ className, hasQueries, isIntentions, next, recentlyOnline, setNominators, stakingOverview }: Props): React.ReactElement<Props> {
  const { byAuthor, lastBlockAuthors } = useContext(BlockAuthorsContext);

  return (
    <div className={`staking--Overview ${className}`}>
      <CurrentList
        authorsMap={byAuthor}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        lastAuthors={lastBlockAuthors}
        next={next}
        recentlyOnline={recentlyOnline}
        setNominators={setNominators}
        stakingOverview={stakingOverview}
      />
    </div>
  );
}

export default React.memo(Overview);
