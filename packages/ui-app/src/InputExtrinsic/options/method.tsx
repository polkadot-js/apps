// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Extrinsic$Sections } from '@polkadot/extrinsics/types';
import { DropdownOptions, SectionVisibilityAll } from '../../util/types';

import React from 'react';

import map from '@polkadot/extrinsics';

export default function createOptions (sectionName: Extrinsic$Sections, type: SectionVisibilityAll): DropdownOptions {
  const section = map[sectionName];

  if (!section) {
    return [];
  }

  const methods = section[type];

  return Object
    .keys(methods)
    .sort()
    .filter((name) => {
      const { isDeprecated, isHidden } = methods[name];

      return !isDeprecated && !isHidden;
    })
    .map((name) => {
      const { description, params } = methods[name];
      const inputs = params.map(({ name }) => name).join(', ');

      return {
        className: 'ui--DropdownLinked-Item',
        key: `${sectionName}_${name}`,
        text: [
          <div
            className='ui--DropdownLinked-Item-call'
            key={`${sectionName}_${name}:call`}
          >
            {name}({inputs})
          </div>,
          <div
            className='ui--DropdownLinked-Item-text'
            key={`${sectionName}_${name}:text`}
          >
            {description || name}
          </div>
        ],
        value: name
      };
    });
}
