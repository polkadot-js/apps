// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useBestNumber } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import Query from '../Query.js';
import BlockByHash from './ByHash.js';
import BlockByNumber from './ByNumber.js';

function Entry (): React.ReactElement | null {
  const bestNumber = useBestNumber();
  const { value } = useParams<{ value: string }>();
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  useEffect((): void => {
    setStateValue((stateValue) =>
      value && value !== stateValue
        ? value
        : !stateValue && bestNumber
          ? bestNumber.toString()
          : stateValue
    );
  }, [bestNumber, value]);

  if (!stateValue) {
    return null;
  }

  const Component = isHex(stateValue)
    ? BlockByHash
    : BlockByNumber;

  return (
    <>
      <Query />
      <Component
        key={stateValue}
        value={stateValue}
      />
    </>
  );
}

export default React.memo(Entry);
