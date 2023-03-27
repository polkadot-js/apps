// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');

// incorrect packages without type specifier
[
  // See https://github.com/fragcolor-xyz/fragnova/issues/286
  '@fragnova/api-augment',
  // See https://github.com/LibertyDSNP/frequency/issues/1116
  '@frequency-chain/api-augment'
].forEach((f) => {
  const full = path.join(process.cwd(), `node_modules/${f}/package.json`);
  const json = JSON.parse(fs.readFileSync(full, 'utf8'));

  if (!json.type) {
    json.type = 'module';
    fs.writeFileSync(full, JSON.stringify(json, null, 2));
    console.log('Fixed package type::', f);
  }
});
