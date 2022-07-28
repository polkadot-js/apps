// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { Cid } from './types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { createCid } from './util';

const OPT_RULE = {
  transform: (opt: Option<PalletAllianceCid>): Cid | null =>
    opt.isSome
      ? createCid(opt.unwrap())
      : null
};

function useRuleImpl (): Cid | null | undefined {
  const { api } = useApi();

  return useCall<Cid | null>(api.query.alliance.rule, [], OPT_RULE);
}

export default createNamedHook('useRule', useRuleImpl);
