// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { OfflineStatus } from './types';
import { I18nProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { formatNumber } from '@polkadot/util';

import translate from './translate';

type Props = I18nProps & {
  offline: Array<OfflineStatus>
};

type State = {
  isOpen: boolean
};

class RecentlyOffline extends React.PureComponent<Props, State> {
  state: State = {
    isOpen: false
  };

  render () {
    const { offline, t } = this.props;
    const { isOpen } = this.state;

    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);

    return (
      <div
        className={['staking--Account-recentlyOffline', isOpen ? 'expand' : ''].join(' ')}
        onClick={this.toggleOpen}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {t('Reported offline {{count}} times, last at {{blockNumber}}', {
            replace: {
              count,
              blockNumber: blockNumbers[blockNumbers.length - 1]
            }
          })}
        </div>
      </div>
    );
  }

  private toggleOpen = (): void => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  }
}

export default translate(RecentlyOffline);
