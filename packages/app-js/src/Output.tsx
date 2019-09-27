// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/react-components/types';
import { Log } from './types';

import React from 'react';
import styled from 'styled-components';
import { isError, isNull, isUndefined } from '@polkadot/util';

interface Props extends BareProps {
  children?: React.ReactNode;
  logs: Log[];
}

const format = (value: any): string => {
  if (isError(value)) {
    return value.stack ? value.stack : value.toString();
  } else if (isUndefined(value)) {
    return 'undefined';
  } else if (isNull(value)) {
    return 'null';
  } else if (Array.isArray(value)) {
    return `[${value.map((value): string => format(value)).join(', ')}]`;
  } else if (value instanceof Map) {
    return `{${[...value.entries()].map(([key, value]): string => key + ': ' + format(value)).join(', ')}}`;
  }

  return value.toString();
};

const renderEntry = ({ args, type }: Log, index: number): React.ReactNode => (
  <div className={`js--Log ${type}`} key={index}>
    {args.map((arg): string => format(arg)).join(' ')}
  </div>
);

function Output ({ children, className, logs }: Props): React.ReactElement<Props> {
  return (
    <article className={`container ${className}`}>
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

export default styled(Output)`
  background-color: #4e4e4e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font-family: monospace;
  font-size: 12px;
  font-variant-ligatures: common-ligatures;
  line-height: 18px;
  padding: 50px 10px 10px;
  position: relative;
  width: 40%;

  .logs-wrapper {
    display: flex;
    flex: 1;
    min-height: 0px;
  }

  .logs-container {
    flex: 1;
    overflow: auto;;
  }

  .logs-content {
    height: auto;
  }

  .js--Log {
    animation: fadein 0.2s;
    margin: 0 0 5px 0;
    word-break: break-all;

    &.error {
      color: #f88;
    }
  }
`;
