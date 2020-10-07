// Copyright 2017-2020 @canvas-ui/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

export interface Option {
  info?: string;
  isHeader?: boolean;
  shortText?: React.ReactNode;
  text: React.ReactNode;
  value: string | number;
}
