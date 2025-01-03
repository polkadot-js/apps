// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type Browser = 'chrome' | 'firefox';

export interface Extension {
  desc: string;
  link: string;
  name: string;
}

export interface Known {
  all: Record<Browser, string>;
  desc: string;
  name: string;
  ui: { logo: string; }
}
