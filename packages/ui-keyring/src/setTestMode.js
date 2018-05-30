// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State } from './types';

import createOptions from './options';

export default function setTestMode (state: State, isTest: boolean): void {
  state.isTestMode = isTest;

  createOptions(state);
}
