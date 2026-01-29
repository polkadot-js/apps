// Copyright 2017-2025 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DropdownItemProps, StrictLabelProps } from 'semantic-ui-react';

export type LogType = 'error' | 'log';

export interface Log {
  args: unknown[];
  type: LogType;
}

export interface Snippet extends DropdownItemProps {
  text: string;
  value: string;
  code: string;
  label?: StrictLabelProps;
  type?: 'custom' | 'shared';
}
