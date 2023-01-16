// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId32 } from '@polkadot/types/interfaces';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

const OPT_VALIDATORS = {
  transform: (validators: AccountId32[]): string[] =>
    validators.map((a) => a.toString())
};

function useValidatorsActiveImpl (): string[] | undefined {
  const { api } = useApi();

  return useCall(api.query.session.validators, undefined, OPT_VALIDATORS);
}

export default createNamedHook('useValidatorsActive', useValidatorsActiveImpl);
