// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { StateDb$SectionNames } from '@polkadot/storage/types';

const React = require('react');
const Dropdown = require('semantic-ui-react/dist/es/modules/Dropdown');
const keys = require('@polkadot/storage-substrate/keys');

const options = [];

Object
  .keys(keys)
  .sort()
  .forEach((sectionName: StateDb$SectionNames) => {
    const section = keys[sectionName];

    Object
      .keys(section)
      .sort()
      .forEach((methodName: string, methodIndex: number): void => {
        const { description, isDeprecated, isHidden, params } = section[methodName];
        const fullName = `${sectionName}_${methodName}`;
        const inputs = Object.keys(params).join(', ');

        if (isDeprecated || isHidden) {
          return;
        }

        if (options.length !== 0) {
          options.push(
            <Dropdown.Divider key={`${sectionName}:divider`} />
          );
        }

        if (methodIndex === 0) {
          options.push(
            <Dropdown.Header key={`${sectionName}:header`}>
              {sectionName}
            </Dropdown.Header>
          );
        }

        options.push({
          className: 'ui--InputStorage-Item',
          text: [
            <div
              className='ui--InputStorage-Item-text'
              key={`${fullName}:name`}
            >
              {description || methodName}
            </div>,
            <div
              className='ui--InputStorage-Item-call'
              key={`${fullName}:call`}
            >
              {fullName}({inputs})
            </div>
          ],
          value: fullName
        });
      });
  });

module.exports = options;
