// Copyright 2017-2022 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { CollatorInfo } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_CALL = {
  transform: (lastAuthoredBlock: BN) => ({
    lastAuthoredBlock
  })
};

function useCollatorImpl (accountId: string): CollatorInfo | undefined {
  const { api } = useApi();

  return useCall<CollatorInfo>(api.query.collatorSelection.lastAuthoredBlock, [accountId], OPT_CALL);
}

export default createNamedHook('useCollatorImpl', useCollatorImpl);
