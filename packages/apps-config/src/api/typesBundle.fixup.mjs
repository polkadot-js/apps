// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';
import path from 'path';
import process from 'process';

// incorrect packages without type specifier
const PKG_FIX = [
  '@frequency-chain/api-augment'
];

PKG_FIX.forEach((f) => {
  const full = path.join(process.cwd(), `node_modules/${f}/package.json`);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));

  if (!json.type) {
    json.type = 'module';
    fs.writeFileSync(full, JSON.stringify(json, null, 2));

    console.log('Fixed package type', f);
  }
});
