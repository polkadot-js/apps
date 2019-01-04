#!/usr/bin/env node
// Copyright 2017-2019 @polkadot/client authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

const fs = require('fs');
const path = require('path');

const [compiled] = ['../generator/cli.js']
  .map((file) => path.join(__dirname, file))
  .filter((file) => fs.existsSync(file));

if (compiled) {
  require(compiled);
} else {
  require('@babel/register')({
    extensions: ['.js', '.ts'],
    plugins: [
      ['module-resolver', {
        alias: {
          '^@polkadot/client-(chains|db-chain|db|p2p-messages|p2p|rpc-handlers|rpc|runtime|telemetry|wasm)(.*)': './packages/client-\\1/src\\2',
          '^@polkadot/client(.*)': './packages/client/src\\1'
        }
      }]
    ]
  });
  require('../src/generator/cli.ts');
}
