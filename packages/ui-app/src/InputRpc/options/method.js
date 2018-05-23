// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { InterfaceTypes } from '@polkadot/jsonrpc/types';

import React from 'react';

import map from '@polkadot/jsonrpc';

// flowlint-next-line unclear-type:off
export default function createOptions (sectionName: any): Array<any> {
  const section = map[(sectionName: InterfaceTypes)];

  if (!section) {
    return [];
  }

  return Object
    .keys(section.methods)
    .sort()
    .filter((name) => {
      const { isDeprecated = false, isHidden = false, isSubscription = false } = section.methods[name];

      return !isDeprecated && !isHidden && !isSubscription;
    })
    .map((name) => {
      const { description = '', params = {} } = section.methods[name];
      const inputs = Object.keys(params).join(', ');

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
