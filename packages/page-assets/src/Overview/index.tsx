// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';

import React, { useState } from 'react';

import { Button } from '@polkadot/react-components';

import Create from './Create/index.js';
import Assets from './Assets.js';
import Query from './Query.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  ids?: BN[];
  infos?: AssetInfo[];
  openId: BN;
}

function Overview ({ className, ids, infos, openId }: Props): React.ReactElement<Props> {
  const [keyword, setKeyword] = useState('');
  const filteredInfos = keyword ? infos?.filter(({ key, metadata }) => key === keyword || metadata?.name.toUtf8().includes(keyword)) : infos;

  return (
    <div className={className}>
      <Summary numAssets={ids?.length} />
      <Query onQuery={setKeyword} />
      <Button.Group>
        <Create
          assetIds={ids}
          openId={openId}
        />
      </Button.Group>
      <Assets infos={filteredInfos} />
    </div>
  );
}

export default React.memo(Overview);
