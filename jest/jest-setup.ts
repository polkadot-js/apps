// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@testing-library/jest-dom';

import { configure } from '@testing-library/dom';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line no-global-assign
CSS = { supports (): boolean {
  return false;
} };

configure({ asyncUtilTimeout: 10000 });
