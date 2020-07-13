// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DefinitionRpc, DefinitionRpcSub, OverrideModuleType, OverrideVersionedType } from '@polkadot/types/types';

export interface CustomDefinition {
  alias: Record<string, OverrideModuleType>;
  rpc: Record<string, Record<string, DefinitionRpc | DefinitionRpcSub>>;
  types: OverrideVersionedType[];
}
