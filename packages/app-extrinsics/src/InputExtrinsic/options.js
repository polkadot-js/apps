// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import React from 'react';

import extrinsics from '../extrinsics';

const options = {
  private: [],
  public: []
};

extrinsics.sections.forEach(({ description, hasPrivate, hasPublic, methods, name }) => {
  const header = {
    className: 'ui--InputExtrinsic-Header',
    disabled: true,
    text: description,
    value: name
  };

  hasPublic && options.public.push(header);
  hasPrivate && options.private.push(header);

  methods.forEach(({ description, name, isPrivate }) => {
    options[isPrivate ? 'private' : 'public'].push({
      className: 'ui--InputExtrinsic-Item',
      text: [
        <div className='ui--InputExtrinsic-Item-text'>{description}</div>,
        <div className='ui--InputExtrinsic-Item-call'>{name}</div>
      ],
      value: name
    });
  });
});

export default options;
