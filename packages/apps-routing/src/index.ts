// Copyright 2017-2021 @canvas-ui/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import deploy from './deploy';
import execute from './execute';
import settings from './settings';
import { Routes } from './types';
import upload from './upload';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Routes {
  return [
    upload(t),
    deploy(t),
    execute(t),
    settings(t)
  ];
}
