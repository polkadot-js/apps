// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

export type KeyringOption = {
  'data-manual'?: boolean,
  name: string,
  text: React$Node | string,
  value: string
};

export type KeyringOptions = Array<KeyringOption>;
