// Copyright 2017-2020 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
