// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge, Icon } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  isElected: boolean;
  onlineCount?: false | number;
  onlineMessage?: boolean;
}

function Status ({ isElected, onlineCount, onlineMessage }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <td className='together'>
      {isElected && (
        <Badge
          hover={t('Selected for the next session')}
          info={<Icon name='chevron right' />}
          isInline
          isTooltip
          type='next'
        />
      )}
      {(!!onlineCount || onlineMessage) && (
        <Badge
          hover={t('Active with {{blocks}} blocks authored{{hasMessage}} heartbeat message', {
            replace: {
              blocks: formatNumber(onlineCount || 0),
              hasMessage: onlineMessage ? ' and a' : ', no'
            }
          })}
          info={<Icon name='check' />}
          isInline
          isTooltip
          type='online'
        />
      )}
    </td>
  );
}

export default React.memo(Status);
