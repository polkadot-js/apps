// Copyright 2017-2024 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import useChainInfo from '../useChainInfo.js';
import useRawMetadata from '../useRawMetadata.js';
import Extensions from './Extensions.js';
import NetworkSpecs from './NetworkSpecs.js';

export default function Metadata (): React.ReactElement {
  const rawMetadata = useRawMetadata();
  const chainInfo = useChainInfo();

  return (
    <>
      <Extensions
        chainInfo={chainInfo}
        rawMetadata={rawMetadata}
      />
      <NetworkSpecs chainInfo={chainInfo} />
    </>
  );
}
