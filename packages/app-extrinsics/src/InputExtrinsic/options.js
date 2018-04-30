// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';
import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';
import extrinsics from '@polkadot/extrinsics-polkadot/src';

const options = {
  private: [],
  public: []
};

const sortByName = (a, b) =>
  a.name.localeCompare(b.name);

const addHeader = (shouldAdd, to, name, description) => {
  if (shouldAdd) {
    if (to.length) {
      to.push(<Dropdown.Divider key={`${name}:divider`} />);
    }

    to.push(
      <Dropdown.Header key={`${name}:header`}>
        {description}
      </Dropdown.Header>
    );
  }
};

extrinsics.sections.sort(sortByName).forEach(({ description, hasPrivate, hasPublic, methods, name }) => {
  addHeader(hasPublic, options.public, name, description);
  addHeader(hasPrivate, options.private, name, description);

  methods.sort(sortByName).forEach(({ description, name, params, isPrivate }) => {
    const inputs = params.map(({ name }) => name).join(', ');

    options[isPrivate ? 'private' : 'public'].push({
      className: 'ui--InputExtrinsic-Item',
      text: [
        <div
          className='ui--InputExtrinsic-Item-text'
          key={`${name}:name`}
        >
          {description || name}
        </div>,
        <div
          className='ui--InputExtrinsic-Item-call'
          key={`${name}:call`}
        >
          {name}({inputs})
        </div>
      ],
      value: name
    });
  });
});

export default options;
