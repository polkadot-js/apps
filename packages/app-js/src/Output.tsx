// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { Log } from './types';

import React from 'react';
import { isError, isNull, isUndefined } from '@polkadot/util';

type Props = BareProps & {
  children?: React.ReactNode,
  logs: Array<Log>
};

const format = (value: any): string => {
  if (isError(value)) {
    return value.stack ? value.stack : value.toString();
  } else if (isUndefined(value)) {
    return 'undefined';
  } else if (isNull(value)) {
    return 'null';
  } else if (Array.isArray(value)) {
    return `[${value.map((value) => format(value)).join(', ')}]`;
  } else if (value instanceof Map) {
    return `{${[...value.entries()].map(([key, value]) => key + ': ' + format(value)).join(', ')}}`;
  }

  return value.toString();
};

const renderEntry = ({ args, type }: Log, index: number): React.ReactNode => (
  <div className={`js--Log ${type}`} key={index}>
    {args.map((arg) => format(arg)).join(' ')}
  </div>
);

export default class Output extends React.PureComponent<Props> {
  render () {
    const { children, logs } = this.props;

    return (
      <article className='container js--Output'>
        <div className='logs-wrapper'>
          <div className='logs-container'>
            <pre className='logs-content'>
              {logs.map(renderEntry)}
            </pre>
          </div>
        </div>
        {children}
      </article>
    );
  }
}
