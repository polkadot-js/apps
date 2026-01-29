// Copyright 2017-2025 @polkadot/react-query authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

import React, { useEffect, useState } from 'react';

import { styled } from '@polkadot/react-components/styled';
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

  return withDecimal
    ? <>{pre}.{post} <span className='timeUnit'>{type}</span></>
    : <>{pre} <span className='timeUnit'>{type}</span></>;
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
    <StyledDiv className={`${className} ui--Elapsed --digits`}>
      {getDisplayValue(now, value)}{children}
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  .timeUnit {
    font-size: var(--font-percent-tiny);
  }
`;

export default React.memo(Elapsed);
