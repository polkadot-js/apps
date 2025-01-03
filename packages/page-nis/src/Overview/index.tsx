// Copyright 2017-2025 @polkadot/app-nis authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Button } from '@polkadot/react-components';

import { useProxies } from '../useProxies.js';
import BidAdd from './BidAdd.js';
import Queues from './Queues.js';
import Summary from './Summary.js';
import useInfo from './useInfo.js';

interface Props {
  className?: string;
}

function Overview ({ className }: Props): React.ReactElement<Props> {
  const proxies = useProxies();
  const { info } = useInfo();

  const isDisabled = !info?.summary || info.summary.proportionOwed.isZero();

  return (
    <div className={className}>
      <Summary
        info={info}
        isDisabled={isDisabled}
      />
      <Button.Group>
        <BidAdd
          isDisabled
          proxies={proxies}
        />
      </Button.Group>
      <Queues queueTotals={info?.queueTotals} />
    </div>
  );
}

export default React.memo(Overview);
