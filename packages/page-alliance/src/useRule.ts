// Copyright 2017-2025 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletAllianceCid } from '@polkadot/types/lookup';
import type { Rule } from './types.js';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

import { createCid } from './util.js';

const OPT_RULE = {
  transform: (opt: Option<PalletAllianceCid>): Rule =>
    opt.isSome
      ? { cid: createCid(opt.unwrap()), hasRule: true }
      : { cid: null, hasRule: false }
};

function useRuleImpl (): Rule | undefined {
  const { api } = useApi();

  return useCall<Rule>(api.query.alliance.rule, [], OPT_RULE);
}

export default createNamedHook('useRule', useRuleImpl);
