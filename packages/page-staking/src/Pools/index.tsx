// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

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

  const noCreate = useMemo(
    () => !ids || (!!params.maxPools && (ids.length > params.maxPools)),
    [ids, params]
  );

  return (
    <div className={className}>
      <Summary
        params={params}
        poolCount={ids?.length}
      />
      <Button.Group>
        <Create
          isDisabled={noCreate}
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
