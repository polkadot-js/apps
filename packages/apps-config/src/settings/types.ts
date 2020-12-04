// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface Option {
  info?: string;
  isDisabled?: boolean;
  isHeader?: boolean;
  text: React.ReactNode;
  value: string | number;
}

export interface LinkOption extends Option {
  dnslink?: string;
  isChild?: boolean;
  isDevelopment?: boolean;
  textBy: string;
}
