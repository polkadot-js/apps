// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionCallNamed } from '@polkadot/types/types';
import type { DropdownOption, DropdownOptions } from '../../util/types.js';

import React from 'react';

export default function createOptions (runtime: Record<string, Record<string, DefinitionCallNamed>>, sectionName?: string | null): DropdownOptions {
  if (!sectionName) {
    return [];
  }

  const section = runtime[sectionName];

  if (!section || Object.keys(runtime[sectionName]).length === 0) {
    return [];
  }

  return Object
    .keys(runtime[sectionName])
    .filter((s) => !s.startsWith('$'))
    .sort()
    .map((m) => section[m])
    .map(({ description, method, params }): DropdownOption => {
      const inputs = params.map(({ name }) => name).join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${method}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${method}:call`}
          >
            {method}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${method}:text`}
          >
            {description || method}
          </div>
        ],
        value: method
      };
    });
}
