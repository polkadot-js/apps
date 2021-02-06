// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';
import useFundIndexes from './useFundIndexes';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const bestNumber = useCall<BN>(api.derive.chain.bestNumber);
  const fundIndexes = useFundIndexes();

  return (
    <div className={className}>
      <Summary fundCount={fundIndexes.length} />
      <Button.Group>
        <FundAdd bestNumber={bestNumber} />
      </Button.Group>
      <Funds
        bestNumber={bestNumber}
        fundIndexes={fundIndexes}
      />
    </div>
  );
}

export default React.memo(Overview);
