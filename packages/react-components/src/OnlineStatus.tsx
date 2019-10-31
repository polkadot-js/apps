// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';
import { I18nProps } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { formatNumber } from '@polkadot/util';

import Badge from './Badge';
import Icon from './Icon';

import translate from './translate';

interface Props extends I18nProps {
  isTooltip?: boolean;
  value: DerivedStakingOnlineStatus;
}

function OnlineStatus ({ className, value, isTooltip = false, t }: Props): React.ReactElement<Props> | null {
  const [{ hover, info, type }, setType] = useState<{ hover: React.ReactNode; info: React.ReactNode; type: 'online' | 'offline' | null }>({ hover: '', info: '', type: null });

  useEffect((): void => {
    const { online, offline } = value;
    let hover: React.ReactNode = '';
    let info: React.ReactNode = '';
    let type: 'online' | 'offline' | null = null;

    if (offline) {
      const count = offline.reduce((total, { count }): BN => total.add(count), new BN(0));
      const blockNumbers = offline.map(({ blockNumber }): string => `#${formatNumber(blockNumber)}`);

      info = count.toString();
      hover = t('Reported offline {{count}} times, last at {{blockNumber}}', {
        replace: {
          count,
          blockNumber: blockNumbers[blockNumbers.length - 1]
        }
      });
      type = 'offline';
    } else if (online && online.isOnline) {
      const blockNumber = value.online ? value.online.blockNumber : null;

      info = <Icon name='check' />;
      hover = blockNumber
        ? t('Reported online at #{{blockNumber}}', {
          replace: {
            blockNumber: formatNumber(blockNumber)
          }
        })
        : t('Reported online in the current session');
      type = 'online';
    }

    setType({ hover, info, type });
  }, [value]);

  if (!type) {
    return null;
  }

  return (
    <Badge
      className={`ui--OnlineStatus ${className}`}
      hover={hover}
      info={info}
      isTooltip={isTooltip}
      type={type}
    />
  );
}

export default translate(OnlineStatus);
