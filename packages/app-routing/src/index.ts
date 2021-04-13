// Copyright 2017-2021 @polkadot/app-routing authors & contributors
// and @canvas-ui/app-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import execute from './execute';
import instantiate from './instantiate';
import settings from './settings';
import { Routes } from './types';
import upload from './upload';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Routes {
  return [
    upload(t),
    instantiate(t),
    execute(t),
    settings(t)
  ];
}
