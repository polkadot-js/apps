// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

import React from 'react';

import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  dueBlocks: BN;
  endBlock: BN;
  label: string;
}

function DueBlocks ({ dueBlocks, endBlock, label }: Props): React.ReactElement<Props> {
  return (
    <>
      {dueBlocks.gtn(0) && (
        <>
          <BlockToTime value={dueBlocks}>
            &nbsp;({label})
          </BlockToTime>
          #{formatNumber(endBlock)}
        </>
      )}
    </>
  );
}

export default React.memo(DueBlocks);
