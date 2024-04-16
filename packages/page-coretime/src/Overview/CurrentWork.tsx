// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeWorkState } from '@polkadot/types/lookup';

import React from 'react';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeWorkState;
}

function CurrentWork ({ value }: Props): React.ReactElement<Props> {
  const response: string[] = [];

  if (value) {
    value.assignments.forEach((_, index) => {
      const ratio = value.assignments[index][1].ratio.toNumber() / 57600 * 100;

      if (value.assignments[index][0].isIdle) {
        response.push(`${ratio}% Idle`);
      } else if (value.assignments[index][0].isPool) {
        response.push(`${ratio}% Pool`);
      } else {
        response.push(`${ratio}% Task: ${value.assignments[index][0].asTask.toString()}`);
      }
    }
    );
  }

  return (
    <td className='start media--1300'>{response.length > 1 ? response.join(', ') : response[0]}</td>
  );
}

export default React.memo(CurrentWork);
