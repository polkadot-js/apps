// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { CollectionInfo } from '../types';

import React from 'react';

import Collections from './Collections';
import Summary from './Summary';

interface Props {
  className?: string;
  ids?: BN[];
  infos?: CollectionInfo[];
}

function Overview ({ className, ids, infos }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <Summary numCollections={ids?.length} />
      <Collections infos={infos} />
    </div>
  );
}

export default React.memo(Overview);
