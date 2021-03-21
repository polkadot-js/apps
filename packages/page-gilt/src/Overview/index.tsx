// Copyright 2017-2021 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ActiveGiltsTotal } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { BN_ONE } from '@polkadot/util';

import BidAdd from './BidAdd';
import Queues from './Queues';
import Summary from './Summary';

interface Props {
  className?: string;
}

interface GiltInfo {
  activeIndex?: BN | null;
  activeTotal?: ActiveGiltsTotal;
}

const optGiltInfo = {
  defaultValue: {} as GiltInfo,
  transform: ([activeTotal]: [ActiveGiltsTotal]): GiltInfo => ({
    activeIndex: activeTotal.index.isZero()
      ? null
      : activeTotal.index.sub(BN_ONE),
    activeTotal
  })
};

function Overview ({ className }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { activeTotal } = useCallMulti<GiltInfo>([
    api.query.gilt.activeTotal
  ], optGiltInfo);

  return (
    <div className={className}>
      <Summary activeTotal={activeTotal} />
      <Button.Group>
        <BidAdd />
      </Button.Group>
      <Queues />
    </div>
  );
}

export default React.memo(Overview);
