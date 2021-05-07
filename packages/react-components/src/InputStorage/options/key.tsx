// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageEntry } from '@polkadot/types/primitive/types';
import type { DropdownOption, DropdownOptions } from '../../util/types';

import React from 'react';

import { ApiPromise } from '@polkadot/api';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';

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
      const input = type.isPlain
        ? ''
        : type.isMap
          ? type.asMap.key.toString()
          : type.isDoubleMap
            ? `${type.asDoubleMap.key1.toString()}, ${type.asDoubleMap.key2.toString()}`
            : type.asNMap.keyVec.map((k) => k.toString()).join(', ');
      const output = method.meta.modifier.isOptional
        ? `Option<${unwrapStorageType(type)}>`
        : unwrapStorageType(type);

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
