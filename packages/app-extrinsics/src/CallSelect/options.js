// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import extrinsics from '../extrinsics';

export const optionsPublic = [];
export const optionsPrivate = [];

extrinsics.sections.forEach(({ description, hasPublic, hasPrivate, methods, name }) => {
  const header = {
    disabled: true,
    text: description,
    value: name
  };

  hasPublic && optionsPublic.push(header);
  hasPrivate && optionsPrivate.push(header);

  methods.forEach(({ description, name, isPrivate }) => {
    (isPrivate ? optionsPrivate : optionsPublic).push({
      className: 'extrinsics--CallSelect-indent',
      text: description,
      value: name
    });
  });
});
