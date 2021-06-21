// Copyright 2017-2021 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Keys, ValidatorId } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';

import React from 'react';

import { Option, Raw } from '@polkadot/types';
import { isFunction, isNull, isUndefined, u8aToHex } from '@polkadot/util';

interface DivProps {
  className?: string;
  key?: string;
}

function div ({ className = '', key }: DivProps, ...values: React.ReactNode[]): React.ReactNode {
  return (
    <div
      className={`ui--Param-text ${className}`}
      key={key}
    >
      {values}
    </div>
  );
}

function formatKeys (keys: [ValidatorId, Keys][]): string {
  return JSON.stringify(
    keys.map(([validator, keys]): [string, string] => [
      validator.toString(), keys.toHex()
    ])
  );
}

function toHuman (value: Codec | Codec[]): unknown {
  return isFunction((value as Codec).toHuman)
    ? (value as Codec).toHuman()
    : Array.isArray(value)
      ? value.map((v) => toHuman(v))
      : value.toString();
}

function toString (value: any): string {
  return JSON
    .stringify(value, null, 2)
    .replace(/"/g, '')
    .replace(/\\/g, '')
    .replace(/\],\[/g, '],\n[');
}

export default function valueToText (type: string, value: Codec | undefined | null, contentShorten = true): React.ReactNode {
  if (isNull(value) || isUndefined(value)) {
    return div({}, '<unknown>');
  }

  return div(
    {},
    ['Bytes', 'Raw', 'Option<Keys>', 'Keys'].includes(type) && isFunction(value.toU8a)
      ? u8aToHex(value.toU8a(true), contentShorten ? 512 : -1)
      // HACK Handle Keys as hex-only (this should go away once the node value is
      // consistently swapped to `Bytes`)
      : type === 'Vec<(ValidatorId,Keys)>'
        ? toString(formatKeys(value as unknown as [ValidatorId, Keys][]))
        : value instanceof Raw
          ? value.isEmpty
            ? '<empty>'
            : value.toString()
          : (value instanceof Option) && value.isNone
            ? '<none>'
            : toString(toHuman(value))
  );
}
