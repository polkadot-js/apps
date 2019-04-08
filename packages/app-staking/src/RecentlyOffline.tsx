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
  open: Boolean
};

class RecentlyOffline extends React.PureComponent<Props> {
  state: State = {
    open: false
  };

  render () {
    const { offline, t } = this.props;
    const { open } = this.state;

    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);

    return (
      <div
        className={['staking--Account-recentlyOffline', open ? 'expand' : ''].join(' ')}
        onClick={this.toggleOpen}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {t('Reported offline {{count}} times, at {{blockNumbers}}', {
            replace: {
              count: count.toString(),
              blockNumbers: blockNumbers.join(', ')
            }
          })}
        </div>
      </div>
    );
  }

  private toggleOpen = (): void => {
    const { open } = this.state;
    this.setState({ open: !open });
  }
}

export default translate(RecentlyOffline);
