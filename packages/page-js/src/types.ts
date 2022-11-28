// Copyright 2017-2022 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LabelProps, SemanticShorthandItem } from 'semantic-ui-react';

export type LogType = 'error' | 'log';

export interface Log {
  args: unknown[];
  type: LogType;
}

export interface Snippet {
  text: string;
  value: string;
  code: string;
  label?: SemanticShorthandItem<LabelProps>;
  type?: 'custom' | 'shared';
}
