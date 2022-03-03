// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

import Create from './Create';
import Pools from './Pools';
import Summary from './Summary';
import useParams from './useParams';

interface Props {
  className?: string;
}

function NominationPools ({ className }: Props): React.ReactElement<Props> {
  const params = useParams();

  return (
    <div className={className}>
      <Summary params={params} />
      <Button.Group>
        <Create params={params} />
      </Button.Group>
      <Pools params={params} />
    </div>
  );
}

export default React.memo(NominationPools);
