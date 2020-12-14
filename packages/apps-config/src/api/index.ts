// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import typesChain from './chain';
import typesSpec from './spec';

export { default as typesBundle } from './bundle';
export * from './constants';
export * from './params';

export function getChainTypes (specName: string, chainName: string): Record<string, string | Record<string, unknown>> {
  return {
    ...(typesSpec[specName as 'edgeware'] || {}),
    ...(typesChain[chainName as 'Beresheet'] || {})
  };
}

export {
  typesChain,
  typesSpec
};
