// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor } from '@polkadot/types/lookup';

import React from 'react';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor;
}

function CoreQueue ({ value }: Props): React.ReactElement<Props> {
  if (value) {
    return (
      <>
        <td className='start media--1600'>{value?.first.toString()}</td>
        <td className='start media--1900'>{value?.last.toString()}</td>
      </>
    );
  } else {
    return (
      <td className='start media--1600'>{'Queue empty'}</td>
    );
  }
}

export default React.memo(CoreQueue);
