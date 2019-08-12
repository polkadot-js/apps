// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';
import { OfflineStatus } from '@polkadot/app-staking/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import Tooltip from './Tooltip';

import translate from './translate';
import { classes } from './util';

interface Props extends I18nProps {
  accountId: AccountId | string;
  offline: OfflineStatus[];
  tooltip?: boolean;
}

interface State {
  isOpen: boolean;
}

class RecentlyOffline extends React.PureComponent<Props, State> {
  public state: State = {
    isOpen: false
  };

  public render (): React.ReactNode {
    const { accountId, className, offline, tooltip = false, t } = this.props;
    const { isOpen } = this.state;

    if (!offline) {
      return null;
    }

    const count = offline.reduce((total, { count }): BN => total.add(count), new BN(0));
    const blockNumbers = offline.map(({ blockNumber }): string => `#${formatNumber(blockNumber)}`);
    const text = t('Reported offline {{count}} times, last at {{blockNumber}}', {
      replace: {
        count,
        blockNumber: blockNumbers[blockNumbers.length - 1]
      }
    });

    return (
      <div
        className={classes('ui--RecentlyOffline', isOpen && 'expand', tooltip && 'tooltip', className)}
        {...(!tooltip ? { onClick: this.toggleOpen } : {})}
        data-for={`offline-${accountId}`}
        data-tip={true}
        data-tip-disable={!tooltip}
      >
        <div className='badge'>{count.toString()}</div>
        <div className='detail'>{text}</div>
        <Tooltip
          trigger={`offline-${accountId}`}
          text={text}
        />
      </div>
    );
  }

  private toggleOpen = (): void => {
    this.setState(({ isOpen }): State => ({
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
  padding: 0;
  text-align: center;
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
`);
