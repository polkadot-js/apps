// Copyright 2017-2021 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

import Assets from './Assets';
import Create from './Create';
import Summary from './Summary';
import useAssetIds from './useAssetIds';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const assetIds = useAssetIds();

  return (
    <div className={className}>
      <Summary numAssets={assetIds?.length} />
      <Button.Group>
        <Create assetIds={assetIds} />
      </Button.Group>
      <Assets assetIds={assetIds} />
    </div>
  );
}

export default React.memo(Overview);
