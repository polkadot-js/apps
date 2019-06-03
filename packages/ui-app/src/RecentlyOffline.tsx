// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { AccountId } from '@polkadot/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { OfflineStatus } from '@polkadot/app-staking/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import Tooltip from './Tooltip';

import translate from './translate';
import { classes } from './util';

type Props = I18nProps & {
  accountId: AccountId | string,
  offline: Array<OfflineStatus>,
  tooltip?: boolean,
  inline?: boolean
};

type State = {
  isOpen: boolean
};

class RecentlyOffline extends React.PureComponent<Props, State> {
  state: State = {
    isOpen: false
  };

  render () {
    const { accountId, className, inline, offline, tooltip = false, t } = this.props;
    const { isOpen } = this.state;
    const count = offline.reduce((total, { count }) => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }) => `#${formatNumber(blockNumber)}`);
    const text = t('Reported offline {{count}} times, last at {{blockNumber}}', {
      replace: {
        count,
        blockNumber: blockNumbers[blockNumbers.length - 1]
      }
    });

    return (
      <div
        className={classes('ui--RecentlyOffline', isOpen && 'expand', tooltip && 'tooltip', inline && 'inline', className)}
        {...(!tooltip ? { onClick: this.toggleOpen } : {})}
        data-for={`offline-${accountId}`}
        data-tip={true}
        data-tip-disable={!tooltip}
      >
        <div className='badge'>
          {count.toString()}
        </div>
        <div className='detail'>
          {text}
        </div>
        <Tooltip
          trigger={`offline-${accountId}`}
          text={text}
        />
      </div>
    );
  }

  private toggleOpen = (): void => {
    this.setState(({ isOpen }) => ({
      isOpen: !isOpen
    }));
  }
}

export default translate(styled(RecentlyOffline)`
  background: red;
  border-radius: 16px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  color: #eee;
  cursor: help;
  display: flex;
  font-size: 12px;
  height: 22px;
  justify-content: center;
  left: 1rem;
  padding: 0;
  position: absolute;
  text-align: center;
  top: 1rem;
  transition: all ease .2s;
  width: 22px;

  & > * {
    line-height: 22px;
    overflow: hidden;
    transition: all ease 0.25;
  }

  .badge {
    font-weight: bold;
    width: auto;
  }

  .detail {
    width: 0;
  }

  &.expand {
    width: 300px;

    .badge {
      width: 0;
    }

    .detail {
      width: auto;
    }
  }

  &.inline {
    left: auto;
    position: absolute;
    right: -2.75rem;
    top: -1rem;
    z-index: 1;
  }
`);
