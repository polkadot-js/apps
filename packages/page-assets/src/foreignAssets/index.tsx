// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AnyJson } from '@polkadot/types-codec/types';

import React from 'react';

import Summary from './Summary.js';

interface Props {
  className?: string;
  locations?: AnyJson[];
}

const ForeignAssets = ({ className, locations }: Props) => {
  return (
    <div className={className}>
      <Summary numAssets={locations?.length} />
      {/* <Assets infos={filteredInfos} /> */}
    </div>
  );
};

export default React.memo(ForeignAssets);
