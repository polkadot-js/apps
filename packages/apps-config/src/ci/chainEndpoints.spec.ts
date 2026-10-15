// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import WebSocket from 'ws';

import { isString } from '@polkadot/util';

import { createWsEndpoints } from '../endpoints/index.js';
import { readRpcFiles, RpcEndpointsSchema } from '../endpoints/rpcEndpoint.js';
import { fetchJson } from './fetch.js';

interface Endpoint {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

interface RpcResponse {
  error?: { message: string };
  id: number;
  result?: unknown;
}

// Endpoints are retried before being reported
const ATTEMPTS = 3;
const RETRY_DELAY = 5_000;
const TIMEOUT = 5_000;

// Connect the same way the apps UI does from a browser. Some providers reject
// non-browser clients, e.g. the Node.js built-in WebSocket sends 'User-Agent: node'
const HEADERS = {
  Origin: 'https://polkadot.js.org',
  'User-Agent': 'Mozilla/5.0 (polkadot-js/apps chainEndpoints check)'
};

function createError (reason: string): Error {
  return Object.assign(new Error(reason), { code: reason });
}

function getErrorReason (error: Error & { code?: string }): string {
  // e.g. 'CERT_HAS_EXPIRED (certificate has expired)'
  return `${String(error.code)}: ${error.message}`;
}

function checkEndpoint ({ ws: endpoint }: Endpoint): Promise<void> {
  return new Promise((resolve, reject): void => {
    const websocket = new WebSocket(endpoint, { handshakeTimeout: TIMEOUT, headers: HEADERS });
    const timerId = setTimeout(() => done(createError('Connection timeout')), TIMEOUT);

    function done (error?: Error): void {
      clearTimeout(timerId);
      websocket.removeAllListeners();
      // terminate() can still emit an error (while connecting), which would otherwise be thrown
      websocket.on('error', () => undefined);
      websocket.terminate();

      error
        ? reject(error)
        : resolve();
    }

    websocket.on('unexpected-response', (_, { statusCode, statusMessage }) =>
      done(createError(`Unexpected response. code: '${statusCode}' reason: '${statusMessage}'`))
    );

    websocket.on('error', (error) =>
      done(createError(getErrorReason(error)))
    );

    websocket.on('close', (code, reason) =>
      done(createError(`Disconnected. code: '${code}' reason: '${reason.toString()}'`))
    );

    websocket.on('open', (): void => {
      websocket.send(JSON.stringify({ id: 1, jsonrpc: '2.0', method: 'chain_getFinalizedHead', params: [] }));
    });

    websocket.on('message', (data): void => {
      let response: RpcResponse;

      try {
        response = JSON.parse((data as Buffer).toString('utf8')) as RpcResponse;
      } catch {
        return done(createError('Invalid JSON response'));
      }

      if (response.error) {
        return done(createError(`RPC error: ${response.error.message}`));
      }

      isString(response.result) && response.result.startsWith('0x')
        ? done()
        : done(createError('Invalid/non-hex finalized head response'));
    });
  });
}

async function checkWithRetries (endpoint: Endpoint): Promise<true> {
  const [,, hostWithPort] = endpoint.ws.split('/');
  const [host] = hostWithPort.split(':');

  // fail fast if the dns doesn't exist
  const dns = await fetchJson<DnsResponse>(`https://dns.google/resolve?name=${host}`);

  // only fail on a negative answer, a null here means the lookup itself failed/timed out
  if (dns && !dns.Answer) {
    throw createError(`No DNS entry for ${host}`);
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    if (attempt > 1) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    }

    try {
      await checkEndpoint(endpoint);

      return true;
    } catch (error) {
      lastError = error as Error;
    }
  }

  throw lastError;
}

/**
 * All the (enabled) endpoints from the apps config
 */
function getConfigEndpoints (): Endpoint[] {
  return createWsEndpoints()
    .filter(({ isDisabled, isUnreachable, value }) =>
      !isDisabled &&
      !isUnreachable &&
      value &&
      isString(value) &&
      !value.includes('127.0.0.1') &&
      !value.startsWith('light://')
    )
    .map(({ text, value }): Partial<Endpoint> => ({
      name: text as string,
      ws: value
    }))
    .filter((v): v is Endpoint => !!v.ws);
}

/**
 * All the (enabled) endpoints from the ../endpoints/rpc/<chain-id>.json files
 */
function getJsonEndpoints (): Endpoint[] {
  return readRpcFiles(new URL('../endpoints/rpc/', import.meta.url))
    .flatMap(({ content, file }) =>
      // throws (with the reason) on an invalid file, see rpc.spec.ts
      RpcEndpointsSchema.parse(content)
        .filter(({ disabled }) => !disabled)
        .map(({ name, rpc }): Endpoint => ({
          name: `${file} (${name})`,
          ws: rpc
        }))
    );
}

/**
 * The endpoints to check, as selected by CHECK_ENDPOINTS:
 *   - all: all the endpoints from the apps config
 *   - json: only the endpoints from the json files
 */
function getEndpoints (): Endpoint[] {
  const source = process.env.CHECK_ENDPOINTS;

  switch (source) {
    case 'all':
      return getConfigEndpoints();

    case 'json':
      return getJsonEndpoints();

    default:
      throw new Error(`Invalid CHECK_ENDPOINTS=${source}, expected 'all' or 'json'`);
  }
}

describe('check endpoints', (): void => {
  const endpoints = getEndpoints();

  for (const endpoint of endpoints) {
    it(`${endpoint.name} @ ${endpoint.ws}`, async (): Promise<void> => {
      expect(await checkWithRetries(endpoint)).toBe(true);
    });
  }
});
