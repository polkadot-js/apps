// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// duplicated from https://github.com/polkadot-js/api/blob/bb75b422730d6bf5189a87e9b7bbd1585bd5cd26/packages/rpc-provider/src/substrate-connect/ScProvider.spec.ts#L1

import type { Chain, JsonRpcCallback } from '@substrate/connect';

type MockChain = Chain & {
  _spec: () => string
  _recevedRequests: () => string[]
  _isTerminated: () => boolean
  _triggerCallback: (response: string | {}) => void
  _setTerminateInterceptor: (fn: () => void) => void
  _setSendJsonRpcInterceptor: (fn: (rpc: string) => void) => void
  _getLatestRequest: () => string
}

const getFakeChain = (spec: string, callback: JsonRpcCallback): MockChain => {
  const _receivedRequests: string[] = [];
  let _isTerminated = false;

  let terminateInterceptor: Function = Function.prototype;
  let sendJsonRpcInterceptor: Function = Function.prototype;

  return {
    _spec: () => spec,
    _recevedRequests: () => _receivedRequests,
    _isTerminated: () => _isTerminated,
    _triggerCallback: (response) => {
      callback(
        typeof response === 'string' ? response : JSON.stringify(response)
      );
    },
    _setSendJsonRpcInterceptor: (fn) => {
      sendJsonRpcInterceptor = fn;
    },
    _setTerminateInterceptor: (fn) => {
      terminateInterceptor = fn;
    },
    sendJsonRpc: (rpc) => {
      sendJsonRpcInterceptor(rpc);
      _receivedRequests.push(rpc);
    },
    remove: () => {
      terminateInterceptor();
      _isTerminated = true;
    },
    _getLatestRequest: () => _receivedRequests[_receivedRequests.length - 1]
  };
};

const getFakeClient = () => {
  const chains: MockChain[] = [];
  let addChainInterceptor: Promise<void> = Promise.resolve();
  let addWellKnownChainInterceptor: Promise<void> = Promise.resolve();

  return {
    _chains: () => chains,
    _setAddChainInterceptor: (interceptor: Promise<void>) => {
      addChainInterceptor = interceptor;
    },
    _setAddWellKnownChainInterceptor: (interceptor: Promise<void>) => {
      addWellKnownChainInterceptor = interceptor;
    },
    addChain: (chainSpec: string, cb: JsonRpcCallback): Promise<MockChain> =>
      addChainInterceptor.then(() => {
        const result = getFakeChain(chainSpec, cb);

        chains.push(result);

        return result;
      }),
    addWellKnownChain: (
      wellKnownChain: string,
      cb: JsonRpcCallback
    ): Promise<MockChain> =>
      addWellKnownChainInterceptor.then(() => {
        const result = getFakeChain(wellKnownChain, cb);

        chains.push(result);

        return result;
      })
  };
};

enum WellKnownChain {
  polkadot = 'polkadot',
  ksmcc3 = 'ksmcc3',
  rococo_v2_1 = 'rococo_v2_1',
  westend2 = 'westend2'
}

const connectorFactory = () => {
  const clients: ReturnType<typeof getFakeClient>[] = [];
  const latestClient = () => clients[clients.length - 1];

  return {
    WellKnownChain,
    createScClient: () => {
      const result = getFakeClient();

      clients.push(result);

      return result;
    },
    _clients: () => clients,
    latestClient,
    latestChain: () =>
      latestClient()._chains()[latestClient()._chains().length - 1]
  };
};

jest.mock('@substrate/connect', () => connectorFactory());
