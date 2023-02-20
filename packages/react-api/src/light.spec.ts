// Copyright 2017-2023 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import process from 'process';

import { assert } from '@polkadot/util';

import { lightSpecs } from './light';

const srcRel = 'packages/react-api/src';
const specDir = path.join(process.cwd(), srcRel);

describe('lightSpecs', (): void => {
  describe.each(Object.keys(lightSpecs))('%s', (r): void => {
    it.each(Object.keys(lightSpecs[r]))('%s', (s): void => {
      assert(
        fs.existsSync(path.join(specDir, lightSpecs[r][s])),
        `${srcRel}/${lightSpecs[r][s].slice(2)} does not exist`
      );
    });
  });
});
