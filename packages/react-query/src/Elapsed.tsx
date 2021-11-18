// Copyright 2017-2021 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { bnToBn } from '@polkadot/util';

type Ticker = (now: number) => void;

interface Props {
  children?: React.ReactNode;
  className?: string;
  value?: BN | Date | number;
}

const TICK_TIMEOUT = 100;
const tickers = new Map<number, Ticker>();

let lastNow = Date.now();
let lastId = 0;

function tick (): void {
  lastNow = Date.now();

  for (const ticker of tickers.values()) {
    ticker(lastNow);
  }

  setTimeout(tick, TICK_TIMEOUT);
}

function formatValue (value: number, type = 's', withDecimal = false): React.ReactNode {
  const [pre, post] = value.toFixed(1).split('.');
  const before = pre.split('').map((d, index) => (
    <div
      className='digit'
      key={index}
    >{d}</div>
  ));

  return withDecimal
    ? <>{before}.<div className='digit'>{post}</div> {type}</>
    : <>{before} {type}</>;
}

function getDisplayValue (now = 0, value: BN | Date | number = 0): React.ReactNode {
  const tsValue = (
    value && (value as Date).getTime
      ? (value as Date).getTime()
      : bnToBn(value as number).toNumber()
  ) || 0;

  if (!now || !tsValue) {
    return formatValue(0, 's', true);
  }

  const elapsed = Math.max(Math.abs(now - tsValue), 0) / 1000;

  return (elapsed < 60)
    ? formatValue(elapsed, 's', elapsed < 15)
    : (elapsed < 3600)
      ? formatValue(elapsed / 60, 'min')
      : formatValue(elapsed / 3600, 'hr');
}

tick();

function Elapsed ({ children, className = '', value }: Props): React.ReactElement<Props> {
  const [now, setNow] = useState(lastNow);

  useEffect((): () => void => {
    const id = lastId++;

    tickers.set(id, setNow);

    return (): void => {
      tickers.delete(id);
    };
  }, []);

  return (
    <div className={`ui--Elapsed ${className}`}>
      {getDisplayValue(now, value)}{children}
    </div>
  );
}

export default React.memo(styled(Elapsed)`
  .digit {
    display: inline-block;
    width: 1ch;
  }
`);
