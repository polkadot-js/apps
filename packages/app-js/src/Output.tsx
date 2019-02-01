// Copyright 2017-2019 @polkadot/app-123code authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { Log } from './types';

import React from 'react';
import { format } from '@polkadot/util/logger';

type Props = BareProps & {
  children?: React.ReactNode,
  logs: Array<Log>
};

export default class Output extends React.PureComponent<Props> {
  render () {
    const { children, logs } = this.props;

    return (
      <div className='js--Output'>
        {logs.map(this.renderEntry)}
        {children}
      </div>
    );
  }

  private renderEntry = ({ args, type }: Log, index: number) => {
    return (
      <div
        className={`js--Log ${type}`}
        key={index}
      >
        {args.map((arg) => format(arg)).join(' ')}
      </div>
    );
  }
}
