// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { formatNumber } from '@polkadot/util';

import useChainDetails from './useChainDetails';

interface Props {
  className?: string;
  id: ParaId;
}

function ParachainInfo ({ className, id }: Props): React.ReactElement<Props> {
  const { bestNumber, runtimeVersion } = useChainDetails(id);

  return (
    <div className={className}>
      {bestNumber && <div>{formatNumber(bestNumber)}</div>}
      {runtimeVersion && <div className='version'><div className='media--1100'>{runtimeVersion.specName.toString()}</div><div className='media--1100'>/</div><div>{runtimeVersion.specVersion.toString()}</div></div>}
    </div>
  );
}

export default React.memo(styled(ParachainInfo)`
  .version {
    font-size: var(--font-size-small);
    white-space: nowrap;

    > div {
      display: inline-block;
      overflow: hidden;
      max-width: 10em;
      text-overflow: ellipsis;
    }
  }
`);
