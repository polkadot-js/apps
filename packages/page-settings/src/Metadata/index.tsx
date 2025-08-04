// Copyright 2017-2025 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import useChainInfo from '../useChainInfo.js';
import useRawMetadata from '../useRawMetadata.js';
import Extensions from './Extensions.js';
import NetworkSpecs from './NetworkSpecs.js';
import SystemVersion from './SystemVersion.js';

export default function Metadata (): React.ReactElement {
  const { isDevelopment } = useApi();
  const rawMetadata = useRawMetadata();
  const chainInfo = useChainInfo();

  return (
    <>
      {!isDevelopment && (
        <Extensions
          chainInfo={chainInfo}
          rawMetadata={rawMetadata}
        />
      )}
      <NetworkSpecs chainInfo={chainInfo} />
      <SystemVersion />
    </>
  );
}
