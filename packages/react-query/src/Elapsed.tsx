// Copyright 2017-2020 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import { bnToBn } from '@polkadot/util';

type Ticker = (now: number) => void;

interface Props {
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

function getDisplayValue (now = 0, value: BN | Date | number = 0): string {
  const tsValue = (
    value && (value as Date).getTime
      ? (value as Date).getTime()
      : bnToBn(value as number).toNumber()
  ) || 0;
  let display = '0.0 s';

  if (now && tsValue) {
    const elapsed = Math.max(Math.abs(now - tsValue), 0) / 1000;

    if (elapsed < 15) {
      display = `${elapsed.toFixed(1)} s`;
    } else if (elapsed < 60) {
      display = `${elapsed | 0} s`;
    } else if (elapsed < 3600) {
      display = `${elapsed / 60 | 0} min`;
    } else {
      display = `${elapsed / 3600 | 0} hr`;
    }
  }

  return display;
}

tick();

function Elapsed ({ className = '', value }: Props): React.ReactElement<Props> {
  const [now, setNow] = useState(lastNow);

  useEffect((): () => void => {
    const id = lastId++;

    tickers.set(id, setNow);

    return (): void => {
      tickers.delete(id);
    };
  }, []);

  return (
    <div className={['ui--Elapsed', className].join(' ')}>
      {getDisplayValue(now, value)}
    </div>
  );
}

export default React.memo(Elapsed);
