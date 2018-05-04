// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Items } from './types';

import React from 'react';

export default function createItemOptions (items: Items): Array<*> {
  return Object
    .values(items)
    .sort((a, b) => a.name.localeCompare(b.name))
    .filter(({ isDeprecated = false, isHidden = false }) =>
      !isDeprecated && !isHidden
    )
    .map((item) => {
      const { description, name, params = {}, section } = item;
      const inputs = Object.keys(params).join(', ');

      return {
        className: 'ui--RxDropdownLinked-Item',
        expanded: item,
        key: `${section}_${name}`,
        text: [
          <div
            className='ui--RxDropdownLinked-Item-text'
            key={`${section}_${name}:text`}
          >
            {description || name}
          </div>,
          <div
            className='ui--RxDropdownLinked-Item-call'
            key={`${section}_${name}:call`}
          >
            {name}({inputs})
          </div>
        ],
        value: name
      };
    });
}
