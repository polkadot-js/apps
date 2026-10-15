// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { strict as assert } from 'node:assert';

import { readRpcFiles, RpcEndpointsSchema } from './rpcEndpoint.js';

const DIR = new URL('./rpc/', import.meta.url);

describe('rpc json files are valid', (): void => {
  for (const { content, file } of readRpcFiles(DIR)) {
    it(`rpc/${file}`, (): void => {
      // the file name is the chain id, e.g. asset-hub-polkadot.json
      assert(/^[a-z0-9]+(-[a-z0-9]+)*\.json$/.test(file), `${file}: the file name should be the (lowercase, dash-separated) chain id`);

      const result = RpcEndpointsSchema.safeParse(content);

      assert(result.success, `${file}: ${result.error?.issues.map(({ message, path }) => `[${path.join('.')}] ${message}`).join(', ')}`);
    });
  }
});
