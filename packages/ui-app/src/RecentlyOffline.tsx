// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AccountId } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { OfflineStatus } from '@polkadot/app-staking/types';

import BN from 'bn.js';
import React from 'react';
import { formatNumber } from '@polkadot/util';

import ReactTooltip from 'react-tooltip';

import translate from './translate';

type Props = I18nProps & {
  accountId: AccountId | string,
  offline: Array<OfflineStatus>,
  tooltip?: boolean
};

type State = {
  isOpen: boolean
};

class RecentlyOffline extends React.PureComponent<Props, State> {
  state: State = {
    isOpen: false
  };

  render () {
    const { offline, tooltip = false, t } = this.props;
    const { isOpen } = this.state;
    const accountId = this.props.accountId.toString();

    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);

    const tooltipData = {
      'data-for': `offline-${accountId}`,
      'data-tip': true,
      'data-tip-disable': !tooltip
    };

    const text = t('Reported offline {{count}} times, last at {{blockNumber}}', {
      replace: {
        count,
        blockNumber: blockNumbers[blockNumbers.length - 1]
      }
    });

    return (
      <div
        className={[
          'ui--RecentlyOffline',
          isOpen ? 'expand' : '',
          tooltip ? 'tooltip' : ''
        ].join(' ')}
        {...(!tooltip ?
          { onClick: this.toggleOpen } :
          {}
        )}
        {...tooltipData}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {text}
        </div>
        <ReactTooltip
          delayShow={250}
          effect='solid'
          id={`offline-${accountId}`}
          place='bottom'
        >
            {text}
        </ReactTooltip>
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
