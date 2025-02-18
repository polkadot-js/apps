// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StagingXcmV3MultiLocation } from '@polkadot/types/lookup';
import type { ForeignAssetInfo } from '../useForeignAssetInfos.js';

import React from 'react';

import Assets from './Assets.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  foreignAssetInfos?: ForeignAssetInfo[]
  locations?: StagingXcmV3MultiLocation[];
}

function ForeignAssets ({ className, foreignAssetInfos, locations }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary numAssets={locations?.length} />
      <Assets infos={foreignAssetInfos} />
    </div>
  );
}

export default React.memo(ForeignAssets);
