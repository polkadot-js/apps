import * as React from 'react';
import './OfflineIndicator.css';
import { Icon } from './Icon';
import { State } from '../state';
import offlineIcon from '../icons/zap.svg';
import upgradeIcon from '../icons/flame.svg';

export interface Props {
  status: State['status'];
}

export function OfflineIndicator (props: Props): React.ReactElement<any> | null {
  switch (props.status) {
    case 'online':
      return null;
    case 'offline':
      return <div className='OfflineIndicator'><Icon src={offlineIcon} alt='Offline' /></div>;
    case 'upgrade-requested':
      return (
        <div className='OfflineIndicator OfflineIndicator-upgrade'>
          <Icon src={upgradeIcon} alt='New Version Available' />
        </div>
      );
  }
}
