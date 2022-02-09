// Copyright 2017-2022 @polkadot/app-extrinsics authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Inspect } from '@polkadot/types/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Output } from '@polkadot/react-components';
import { u8aToHex } from '@polkadot/util';

interface Props {
  className?: string;
  inspect?: Inspect | null;
  label: React.ReactNode;
}

interface Inspected {
  name: string;
  value: string;
}

function formatInspect ({ inner = [], name = '', outer = [] }: Inspect, result: Inspected[] = []): Inspected[] {
  if (outer.length) {
    const value = new Array<string>(outer.length);

    for (let i = 0; i < outer.length; i++) {
      value[i] = u8aToHex(outer[i], undefined, false);
    }

    result.push({ name, value: value.join(' ') });
  }

  for (let i = 0; i < inner.length; i++) {
    formatInspect(inner[i], result);
  }

  return result;
}

function DecodedInspect ({ className, inspect, label }: Props): React.ReactElement<Props> | null {
  const formatted = useMemo(
    () => inspect && formatInspect(inspect),
    [inspect]
  );

  if (!formatted) {
    return null;
  }

  return (
    <Output
      className={className}
      isDisabled
      label={label}
    >
      <table>
        <tbody>
          {formatted.map(({ name, value }, i) => (
            <tr key={i}>
              <td>{name}</td>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Output>
  );
}

export default React.memo(styled(DecodedInspect)`
  table tr td {
    vertical-align: top;

    &:first-child {
      color: var(--color-label);
      padding-right: 0.5em;
      text-align: right;
      white-space: nowrap;
    }

    &:last-child {
      font: var(--font-mono);
    }
  }
`);
