// Copyright 2017-2025 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Log } from './types.js';

import React from 'react';

import { styled } from '@polkadot/react-components';
import { isError, isNull, isUndefined } from '@polkadot/util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  logs: Log[];
}

const format = (value: unknown): string => {
  if (isError(value)) {
    return value.stack
      ? value.stack
      : value.toString();
  } else if (isUndefined(value)) {
    return 'undefined';
  } else if (isNull(value)) {
    return 'null';
  } else if (Array.isArray(value)) {
    return `[${value.map(format).join(', ')}]`;
  } else if (value instanceof Map) {
    return `{${[...value.entries()]
      .map(([k, v]) => `${(k as string).toString()}: ${format(v)}`)
      .join(', ')}}`;
  }

  // This _could_ fail as well, hence the catch below
  return (value as string).toString();
};

const renderEntry = ({ args, type }: Log, index: number): React.ReactNode => {
  try {
    return (
      <div
        className={`js--Log ${type}`}
        key={index}
      >
        {args.map(format).join(' ')}
      </div>
    );
  } catch (error) {
    // e.g. this would hit here -
    // console.log(api.createType('ProxyType').__proto__)
    return (
      <div
        className={`js--Log ${type} error`}
        key={index}
      >
        Internal error: {(error as Error).stack || (error as Error).message}
      </div>
    );
  }
};

function Output ({ children, className = '', logs }: Props): React.ReactElement<Props> {
  return (
    <StyledArticle className={`${className} container`}>
      <div className='logs-wrapper'>
        <div className='logs-container'>
          <pre className='logs-content'>
            {logs.map(renderEntry)}
          </pre>
        </div>
      </div>
      {children}
    </StyledArticle>
  );
}

const StyledArticle = styled.article`
  background-color: #4e4e4e;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  font: var(--font-mono);
  font-variant-ligatures: common-ligatures;
  line-height: 18px;
  padding: 50px 10px 10px;
  position: relative;
  width: 40%;

  .logs-wrapper {
    display: flex;
    flex: 1;
    min-height: 0;
  }

  .logs-container {
    flex: 1;
    overflow: auto;
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

export default React.memo(Output);
