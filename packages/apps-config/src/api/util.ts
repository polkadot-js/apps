// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { objectSpread } from '@polkadot/util';

export function typesFromDefs (definitions: Record<string, { types: Record<string, any> }>): Record<string, any> {
  return Object
    .values(definitions)
    .reduce((res: Record<string, any>, { types }): Record<string, any> =>
      objectSpread(res, types), {}
    );
}
