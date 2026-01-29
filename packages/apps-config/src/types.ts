// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface TOptions {
  ns?: string;
  replace?: Record<string, unknown>
}

export type TFunction = (keyOrText: string, textOrOptions?: string | TOptions, options?: TOptions) => string;
