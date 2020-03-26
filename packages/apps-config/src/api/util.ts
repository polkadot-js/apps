// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import chainTypes from './chain';
import specTypes from './spec';

export function typesFromDefs (definitions: Record<string, { types: any }>): object {
  return Object
    .values(definitions)
    .reduce((res, { types }): object => ({
      ...res,
      ...types
    }), {});
}

export function getChainTypes (specName: string, chainName: string): object {
  return {
    ...(specTypes[specName as 'kusama'] || {}),
    ...(chainTypes[chainName as 'Westend'] || {})
  };
}
