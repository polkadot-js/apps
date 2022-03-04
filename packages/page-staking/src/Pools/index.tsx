// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

import Create from './Create';
import Pools from './Pools';
import Summary from './Summary';
import useParams from './useParams';
import usePoolIds from './usePoolIds';

interface Props {
  className?: string;
}

function NominationPools ({ className }: Props): React.ReactElement<Props> {
  const ids = usePoolIds();
  const params = useParams();

  return (
    <div className={className}>
      <Summary params={params} />
      <Button.Group>
        <Create
          isDisabled={!ids || (!!params.maxPools && ids.length > params.maxPools)}
          params={params}
        />
      </Button.Group>
      <Pools
        ids={ids}
        params={params}
      />
    </div>
  );
}

export default React.memo(NominationPools);
