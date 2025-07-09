// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keys, ValidatorId } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

import React from 'react';

import { CopyButton } from '@polkadot/react-components';
import { Option, Raw } from '@polkadot/types';
import { isFunction, isNull, isUndefined, stringify, u8aToHex } from '@polkadot/util';

interface DivProps {
  className?: string;
  key?: string;
}

function div ({ className = '', key }: DivProps, ...values: React.ReactNode[]): { cName: string, key: string | undefined, values: React.ReactNode[] } {
  const cName = `${className} ui--Param-text`;

  return {
    cName,
    key,
    values
  };
}

function formatKeys (keys: [ValidatorId, Keys][]): string {
  return JSON.stringify(
    keys.map(([validator, keys]): [string, string] => [
      validator.toString(), keys.toHex()
    ])
  );
}

function toHuman (value: Codec | Codec[]): unknown {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return isFunction((value as Codec).toHuman)
    ? (value as Codec).toHuman()
    : Array.isArray(value)
      ? value.map((v) => toHuman(v))
      : value.toString();
}

export function toHumanJson (value: unknown): string {
  return stringify(value, 2)
    .replace(/,\n/g, '\n')
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/\],\[/g, '],\n[');
}

export default function valueToText (type: string, value: Codec | undefined | null): React.ReactNode {
  if (isNull(value) || isUndefined(value)) {
    const { cName, key, values } = div({}, '<unknown>');

    return (
      <div
        className={cName}
        key={key}
      >
        {values}
      </div>
    );
  }

  const renderedValue = (
    // eslint-disable-next-line @typescript-eslint/unbound-method
    ['Bytes', 'Raw', 'Option<Keys>', 'Keys'].includes(type) && isFunction(value.toU8a)
      ? u8aToHex(value.toU8a(true))
      // HACK Handle Keys as hex-only (this should go away once the node value is
      // consistently swapped to `Bytes`)
      : type === 'Vec<(ValidatorId,Keys)>'
        ? toHumanJson(formatKeys(value as unknown as [ValidatorId, Keys][]))
        : value instanceof Raw
          ? value.isEmpty
            ? '<empty>'
            : value.toString()
          : (value instanceof Option) && value.isNone
            ? '<none>'
            : toHumanJson(toHuman(value))
  );

  const { cName, key, values } = div({}, renderedValue);

  return (
    <div
      className={cName}
      key={key}
    >
      {values}
      <CopyButton value={renderedValue} />
    </div>
  );
}
