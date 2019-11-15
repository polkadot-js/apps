/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber } from '@polkadot/types/interfaces';
import { BareProps } from '@polkadot/react-components/types';

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { withCalls } from '@polkadot/react-api';
import { isHex } from '@polkadot/util';

import Query from '../Query';
import BlockByHash from './ByHash';
import BlockByNumber from './ByNumber';

interface Props extends BareProps {
  chain_bestNumber?: BlockNumber;
}

function Entry ({ chain_bestNumber }: Props): React.ReactElement<Props> | null {
  const { value } = useParams();
  const [stateValue, setStateValue] = useState<string | undefined>(value);

  useEffect((): void => {
    if (value && value !== stateValue) {
      setStateValue(value);
    } else if (!stateValue && chain_bestNumber) {
      setStateValue(chain_bestNumber.toString());
    }
  }, [chain_bestNumber, value]);

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

export default withCalls<Props>('derive.chain.bestNumber')(Entry);
