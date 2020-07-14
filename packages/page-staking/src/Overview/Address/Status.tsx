// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge, Icon } from '@polkadot/react-components';

import MaxBadge from '../../MaxBadge';

interface Props {
  isElected: boolean;
  numNominators?: number;
  onlineCount?: false | number;
  onlineMessage?: boolean;
}

function Status ({ isElected, numNominators, onlineCount, onlineMessage }: Props): React.ReactElement<Props> {
  return (
    <>
      {isElected
        ? (
          <Badge
            color='blue'
            icon='chevron-right'
          />
        )
        : <Badge color='transparent' />
      }
      {(!!onlineCount || onlineMessage) && (
        <Badge
          color='green'
          info={onlineCount || <Icon icon='envelope' />}
        />
      )}
      <MaxBadge numNominators={numNominators} />
    </>
  );
}

export default React.memo(Status);
