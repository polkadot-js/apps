// Copyright 2017-2018 @polkadot/ui-react authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BaseProps } from './types';

import React from 'react';

type Props = BaseProps & {
  value?: Date
};

type State = {
  now?: Date
};

const TICK_TIMEOUT = 100;
const tickers = new Map<Elapsed, (now: Date) => void>();

function tick () {
  const now = new Date();

  for (const ticker of tickers.values()) {
    ticker(now);
  }

  setTimeout(tick, TICK_TIMEOUT);
}

tick();

export default class Elapsed extends React.PureComponent<Props, State> {
  public state: State = {};

  public componentWillMount () {
    tickers.set(this, (now: Date): void => {
      this.setState({
        now
      });
    });
  }

  public componentWillUnmount () {
    tickers.delete(this);
  }

  public render () {
    const { className, style, value } = this.props;
    const { now } = this.state;

    return (
      <div
        className={['ui--Elapsed', className].join(' ')}
        style={style}
      >
        {this.getDisplayValue(now, value)}
      </div>
    );
  }

  private getDisplayValue (now?: Date, value?: Date): string {
    const tsNow = (now && now.getTime()) || 0;
    const tsValue = (value && value.getTime()) || 0;
    let display = '-';

    if (tsNow && tsValue) {
      const elapsed = Math.max(tsNow - tsValue, 0) / 1000;

      if (elapsed < 15) {
        display = `${elapsed.toFixed(1)}s`;
      } else if (elapsed < 60) {
        display = `${elapsed | 0}s`;
      } else {
        display = `${ elapsed / 60 | 0}m`;
      }
    }

    return display;
  }
}
