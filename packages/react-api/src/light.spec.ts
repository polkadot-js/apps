// Copyright 2017-2025 @polkadot/react-api authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import fs from 'fs';
import path from 'path';
import process from 'process';

import { assert } from '@polkadot/util';

import { lightSpecs } from './light/index.js';

const srcRel = 'packages/react-api/src';
const specDir = path.join(process.cwd(), srcRel);

describe('lightSpecs', (): void => {
  for (const [k, specs] of Object.entries(lightSpecs)) {
    describe(`${k}`, (): void => {
      for (const [k, info] of Object.entries(specs)) {
        it(`${k}`, (): void => {
          assert(
            fs.existsSync(path.join(specDir, info)),
            `${srcRel}/${info.slice(2)} does not exist`
          );
        });
      }
    });
  }
});
