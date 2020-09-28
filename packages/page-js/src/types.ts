// Copyright 2017-2020 @polkadot/app-js authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SemanticShorthandItem } from 'semantic-ui-react/dist/commonjs/generic';
import type { LabelProps } from 'semantic-ui-react/dist/commonjs/elements/Label';

export type LogType = 'error' | 'log';

export interface Log {
  args: any[];
  type: LogType;
}

export interface Snippet {
  text: string;
  value: string;
  code: string;
  label?: SemanticShorthandItem<LabelProps>;
  type?: 'custom' | 'shared';
}
