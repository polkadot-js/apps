// Copyright 2017-2021 @polkadot/app-config authors & contributors
// and @canvas-ui/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface Option {
  info?: string;
  isHeader?: boolean;
  shortText?: React.ReactNode;
  text: React.ReactNode;
  value: string | number;
}
