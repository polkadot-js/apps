// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface TOptions {
  ns?: string;
  replace?: Record<string, string>
}

export type TFunction = (keyOrText: string, text?: string, options?: TOptions) => string;
