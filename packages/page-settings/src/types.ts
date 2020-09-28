// Copyright 2017-2020 @polkadot/app-settings authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { MetadataDef } from '@polkadot/extension-inject/types';

export interface ChainInfo extends MetadataDef {
  color: string | undefined;
}
