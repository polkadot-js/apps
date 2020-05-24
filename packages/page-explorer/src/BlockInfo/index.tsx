// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi, useCall } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';

function Entry (): React.ReactElement | null {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
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
