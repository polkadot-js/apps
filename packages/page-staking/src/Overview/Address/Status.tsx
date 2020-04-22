// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge, Icon } from '@polkadot/react-components';

interface Props {
  isElected: boolean;
  onlineCount?: false | number;
  onlineMessage?: boolean;
}

function Status ({ isElected, onlineCount, onlineMessage }: Props): React.ReactElement<Props> {
  return (
    <td className='together'>
      {isElected && (
        <Badge
          info={<Icon name='chevron right' />}
          isInline
          type='next'
        />
      )}
      {(!!onlineCount || onlineMessage) && (
        <Badge
          info={onlineCount || <Icon name='envelope' />}
          isInline
          type='online'
        />
      )}
    </td>
  );
}

export default React.memo(Status);
