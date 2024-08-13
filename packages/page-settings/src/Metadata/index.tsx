// Copyright 2017-2024 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import useChainInfo from '../useChainInfo.js';
import NetworkSpecs from './NetworkSpecs.js';

export default function Metadata (): React.ReactElement {
  const chainInfo = useChainInfo();

  return (
    <>
      <NetworkSpecs chainInfo={chainInfo} />
    </>
  );
}
