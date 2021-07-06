// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo } from 'react';

import { Button } from '@polkadot/react-components';

import BidAdd from './BidAdd';
import Queues from './Queues';
import Summary from './Summary';
import useInfo from './useInfo';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { info } = useInfo();

  const isDisabled = useMemo(
    () => !info || !info.activeTotal || info.activeTotal.target.isZero(),
    [info]
  );

  return (
    <div className={className}>
      <Summary
        activeTotal={info?.activeTotal}
        isDisabled={isDisabled}
      />
      <Button.Group>
        <BidAdd isDisabled={isDisabled} />
      </Button.Group>
      <Queues queueTotals={info?.queueTotals} />
    </div>
  );
}

export default React.memo(Overview);
