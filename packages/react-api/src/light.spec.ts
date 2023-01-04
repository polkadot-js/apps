// Copyright 2017-2023 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';

import { assert } from '@polkadot/util';

import { lightSpecs } from './light';

describe('lightSpecs', (): void => {
  describe.each(Object.keys(lightSpecs))('%s', (r): void => {
    it.each(Object.keys(lightSpecs[r]))('%s', (s): void => {
      assert(
        fs.existsSync(
          path.join(__dirname, lightSpecs[r][s])
        ),
        `packages/react-api/src/${lightSpecs[r][s].slice(2)} does not exist`
      );
    });
  });
});
