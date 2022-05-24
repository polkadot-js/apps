// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHasIdentity } from '@polkadot/api-derive/types';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

type Result = Record<string, DeriveHasIdentity>;

const OPT_CALL = {
  transform: ([[validatorIds], hasIdentities]: [[string[]], DeriveHasIdentity[]]): Record<string, DeriveHasIdentity> => {
    return validatorIds.reduce((result: Record<string, DeriveHasIdentity>, validatorId, index): Record<string, DeriveHasIdentity> => {
      result[validatorId] = hasIdentities[index];

      return result;
    }, {});
  },
  withParamsTransform: true
};

function useIdentitiesImpl (validatorIds: string[] = []): Result | undefined {
  const { api } = useApi();
  const allIdentity = useCall<Result>(api.derive.accounts.hasIdentityMulti, [validatorIds], OPT_CALL);

  return allIdentity;
}

export default createNamedHook('useIdentities', useIdentitiesImpl);
