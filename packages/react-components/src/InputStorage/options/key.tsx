// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntry } from '@polkadot/types/primitive/StorageKey';
import { DropdownOptions, DropdownOption } from '../../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

export default function createOptions (api: ApiPromise, sectionName: string): DropdownOptions {
  const section = api.query[sectionName];

  if (!section || Object.keys(section).length === 0) {
    return [];
  }

  return Object
    .keys(section)
    .sort()
    .map((value): DropdownOption => {
      const method = section[value] as unknown as StorageEntry;
      const type = method.meta.type;
      let input = '';

      if (type.isMap) {
        input = type.asMap.key.toString();
      } else if (type.isDoubleMap) {
        input = type.asDoubleMap.key1.toString() + ', ' + type.asDoubleMap.key2.toString();
      }

      let output = type.toString();

      if (type.isDoubleMap) {
        output = type.asDoubleMap.value.toString();
      }

      if (method.meta.modifier.isOptional) {
        output = `Option<${output}>`;
      }

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${value}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${value}:call`}
          >
            {value}({input}): {output}
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${value}:text`}
          >
            {(method.meta.documentation[0] || method.meta.name).toString()}
          </div>
        ],
        value
      };
    });
}
