// Copyright 2017-2023 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import useChainInfo from '../useChainInfo.js';
import Extensions from './Extensions.js';
import NetworkSpecs from './NetworkSpecs.js';

export default function Metadata (): React.ReactElement {
  const { isDevelopment } = useApi();
  const chainInfo = useChainInfo();

  return (
    <>
      {!isDevelopment && (
        <Extensions chainInfo={chainInfo} />
      )}
      <NetworkSpecs chainInfo={chainInfo} />
    </>
  );
}
