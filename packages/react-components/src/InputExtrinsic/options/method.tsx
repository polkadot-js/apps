// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DropdownOption, DropdownOptions } from '../../util/types.js';

import React from 'react';

export default function createOptions (api: ApiPromise, sectionName: string, filter?: (section: string, method?: string) => boolean): DropdownOptions {
  const section = api.tx[sectionName];
  const isAllowed = !filter || filter(sectionName);

  if (!section || Object.keys(section).length === 0 || !isAllowed) {
    return [];
  }

  return Object
    .keys(section)
    .filter((s) =>
      !s.startsWith('$') &&
      (!filter || filter(sectionName, s))
    )
    .sort()
    .map((value): DropdownOption => {
      const method = section[value];
      const inputs = method.meta.args
        .map((arg) => arg.name.toString())
        .join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {(method.meta.docs[0] || value).toString()}
          </div>
        ],
        value
      };
    });
}
