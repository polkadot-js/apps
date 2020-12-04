// Copyright 2017-2020 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { rpc } from '@sora-substrate/type-definitions';

import { DefinitionRpc } from '@polkadot/types/types';

export default rpc as Record<string, Record<string, DefinitionRpc>>;
