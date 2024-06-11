// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeWorkState } from '@polkadot/types/lookup';

import React, { useRef } from 'react';

import { ExpandButton, Table } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeWorkState;
}

function CurrentWork ({ value }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleIsExpanded] = useToggle(false);
  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([
    ['current work']
  ]);
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

  const needsExpansion = response.length > 1;

  return (
    <Table header={headerRef.current}>
      {value
        ? response.map((r, index) => (
          index < 1
            ? <tr key={index}>
              <td>
                {r}
              </td>{
                needsExpansion &&
                <ExpandButton
                  expanded={isExpanded}
                  onClick={toggleIsExpanded}
                />}
            </tr>
            : <tr key={index}>{
              isExpanded &&
              <td>
                {r}
              </td>}
            </tr>
        ))
        : <tr>
          <td>
            {'No tasks currently assigned'}
          </td>
        </tr>
      }
    </Table>
  );
}

export default React.memo(CurrentWork);
