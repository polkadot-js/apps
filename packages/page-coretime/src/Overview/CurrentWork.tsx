// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeWorkState } from '@polkadot/types/lookup';

import React, { useEffect, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeWorkState;
}

function createAssignments (value?: PolkadotRuntimeParachainsAssignerCoretimeWorkState): string {
  if (value) {
    if (value.assignments.length > 1) {
      return value.assignments.map((_, index) => {
        const ratio = value.assignments[index][1].ratio.toNumber() / 57600 * 100;

        if (value.assignments[index][0].isIdle) {
          return `${ratio}% Idle`;
        } else if (value.assignments[index][0].isPool) {
          return `${ratio}% Pool`;
        } else {
          return `${ratio}% Task: ${value.assignments[index][0].asTask.toString()}`;
        }
      }).join(', ');
    } else {
      if (value.assignments[0][0].isIdle) {
        return '100% Idle';
      } else if (value.assignments[0][0].isPool) {
        return '100% Pool';
      } else {
        return `100% Task: ${value.assignments[0][0].asTask.toString()}`;
      }
    }
  } else {
    return 'Queue empty';
  }
}

function CurrentWork ({ value }: Props): React.ReactElement<Props> {
  const [assignments, setAssignments] = useState('');

  useEffect(() => {
    setAssignments(createAssignments(value));
  }, [value]);

  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([
    ['current work']
  ]);

  return (
    <Table header={headerRef.current}>
      <tr>
        <td className='start media--1300'>{assignments}</td>
      </tr>
    </Table>
  );
}

export default React.memo(CurrentWork);
