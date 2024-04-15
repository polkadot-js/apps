// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeWorkState } from '@polkadot/types/lookup';

import React from 'react';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeWorkState;
}

function CurrentWork({ value }: Props): React.ReactElement<Props> {
  const assignments: string[] = [];
  if (value) {
    if (value.assignments.length > 1) {
      value.assignments.map((_, index) => {
        const ratio = value.assignments[index][1].ratio.toNumber() / 57600 * 100;
        if (value.assignments[index][0].isIdle) {
          assignments.push(`${ratio}% Idle`)
        } else if (value.assignments[index][0].isPool) {
          assignments.push(`${ratio}% Pool`)
        } else {
          assignments.push(`${ratio}% Task: ${value.assignments[index][0].asTask.toString()}`)
        }
      }
      )
      return (
        <td className='start media--1300'>{assignments.join(', ')}</td>
      );
    } else {
      if (value.assignments[0][0].isIdle) {
        return (
          <td className='start media--1300'>{`100% Idle`}</td>
        );
      } else if (value.assignments[0][0].isPool) {
        return (
          <td className='start media--1300'>{`100% Pool`}</td>
        );
      } else {
        return (
          <td className='start media--1300'>{`100% Task: ${value.assignments[0][0].asTask.toString()}`}</td>
        );
      }
    }

  } else {
    return (
      <td className='start media--1300'>{'Queue empty'}</td>
    )
  }
}

export default React.memo(CurrentWork);
