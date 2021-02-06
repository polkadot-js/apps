// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

import FundAdd from './FundAdd';
import Funds from './Funds';
import Summary from './Summary';
import useFundIndexes from './useFundIndexes';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const fundIndexes = useFundIndexes();

  return (
    <div className={className}>
      <Summary fundCount={fundIndexes.length} />
      <Button.Group>
        <FundAdd />
      </Button.Group>
      <Funds fundIndexes={fundIndexes} />
    </div>
  );
}

export default React.memo(Overview);
