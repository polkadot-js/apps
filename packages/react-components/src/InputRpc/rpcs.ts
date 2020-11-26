// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionRpc, DefinitionRpcExt } from '@polkadot/types/types';

import { typesRpc } from '@polkadot/apps-config';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

function toExt (section: string, input: Record<string, DefinitionRpc>): Record<string, DefinitionRpcExt> {
  return Object.entries(input).reduce((output: Record<string, DefinitionRpcExt>, [method, def]): Record<string, DefinitionRpcExt> => {
    output[method] = {
      isSubscription: false,
      jsonrpc: `${method}_${section}`,
      method,
      section,
      ...def
    };

    return output;
  }, {});
}

const all = Object.entries(typesRpc).reduce((all: Record<string, Record<string, DefinitionRpcExt>>, [section, contents]): Record<string, Record<string, DefinitionRpcExt>> => {
  all[section] ??= toExt(section, contents);

  return all;
}, { ...jsonrpc });

export default all;
