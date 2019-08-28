// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingOnlineStatus } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';

import Icon from './Icon';
import Tooltip from './Tooltip';

import translate from './translate';
import { classes } from './util';

interface Props extends I18nProps {
  accountId: AccountId | string;
  tooltip?: boolean;
  value: DerivedStakingOnlineStatus;
}

interface State {
  isOpen: boolean;
  version: 'online' | 'offline' | null;
}

class OnlineStatus extends React.PureComponent<Props, State> {
  public static getDerivedStateFromProps ({ value = {} }: Props): Pick<State, never> {
    const { online, offline } = value;

    if (offline) {
      return { version: 'offline' };
    }
    if (online && online.isOnline) {
      return { version: 'online' };
    }
    return { version: null };
  }

  public state: State = {
    isOpen: false,
    version: null
  };

  public render (): React.ReactNode {
    const { accountId, className, value, tooltip = false, t } = this.props;
    const { isOpen, version } = this.state;

    const key = accountId.toString();
    const classNames: (string | false | undefined)[] = ['ui--OnlineStatus', isOpen && 'expand', tooltip && 'tooltip', className];
    let text: string;
    let contents: React.ReactNode;
    let offline;
    let count;
    let blockNumbers;
    let blockNumber;

    switch (version) {
      case 'offline':
        offline = value.offline || [];
        count = offline.reduce((total, { count }): BN => total.add(count), new BN(0));
        blockNumbers = offline.map(({ blockNumber }): string => `#${formatNumber(blockNumber)}`);

        classNames.push('offline');
        contents = count.toString();
        text = t('Reported offline {{count}} times, last at {{blockNumber}}', {
          replace: {
            count,
            blockNumber: blockNumbers[blockNumbers.length - 1]
          }
        });
        break;

      case 'online':
        blockNumber = value.online ? value.online.blockNumber : null;

        classNames.push('online');
        contents = (
          <Icon name='check' />
        );
        text = blockNumber
          ? t('Reported online at #{{blockNumber}}', {
            replace: {
              blockNumber: formatNumber(blockNumber)
            }
          })
          : t('Reported online in the current session');
        break;

      default:
        return null;
    }

    return (
      <div
        className={classes(...classNames)}
        {...(!tooltip ? { onClick: this.toggleOpen } : {})}
        data-for={`online-status-${key}`}
        data-tip={true}
        data-tip-disable={!tooltip}
      >
        <div className='badge'>
          {contents}
        </div>
        <div className='detail'>
          {text}
        </div>
        <Tooltip
          trigger={`online-status-${key}`}
          text={text}
        />
      </div>
    );
  }

  private toggleOpen = (): void => {
    this.setState(({ isOpen }): Pick<State, never> => ({
      isOpen: !isOpen
    }));
  }
}

export default translate(styled(OnlineStatus as React.ComponentClass<Props, State>)`
  border-radius: 16px;
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.2);
  color: #eee;
  cursor: help;
  display: flex;
  font-size: 12px;
  height: 22px;
  justify-content: center;
  padding: 0 4px;
  text-align: center;
  transition: all ease .2s;
  width: 22px;

  &.offline {
    background: red;
  }

  &.online {
    background: green;
  }

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
