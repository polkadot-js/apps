// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TOptions } from './types';

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
