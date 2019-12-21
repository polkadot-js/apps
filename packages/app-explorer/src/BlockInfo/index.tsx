// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi, useCall } from '@polkadot/react-hooks';
import { isHex } from '@polkadot/util';

import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Entry (props: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const { value } = useParams();
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  useEffect((): void => {
    if (value && value !== stateValue) {
      setStateValue(value);
    } else if (!stateValue && bestNumber) {
      setStateValue(bestNumber.toString());
    }
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
