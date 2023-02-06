// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TOptions } from './types';

import { u8aToString } from '@polkadot/util';
import { base64Decode, unzlibSync } from '@polkadot/wasm-util';

const HDR = ';base64,';

export function defaultT (keyOrText: string, text?: string, options?: TOptions): string {
  return (
    (
      options &&
      options.replace &&
      options.replace.host
    ) ||
    text ||
    keyOrText
  );
}

export function unz (base64: string, lenIn: number, lenOut: number): string {
  return u8aToString(
    unzlibSync(
      base64Decode(
        base64.substring(HDR.length),
        new Uint8Array(lenIn)
      ),
      new Uint8Array(lenOut)
    )
  );
}
