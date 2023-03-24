// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { map } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';

import { SignedBalance, u64FromCurrency } from './equilibrium.js';

const TOKENS = ['gens'];

const definitions: OverrideBundleDefinition = {
  derives: TOKENS.reduce((prev, token) => {
    return {
      ...prev,

      [token]: { customAccount: (instanceId: string, api: ApiInterfaceRx) => {
        const { registry } = api;
        const asset = u64FromCurrency(token);

        return memo(instanceId, (address: AccountIndex | AccountId | Address | string) => api.query.eqBalances.account(address, { 0: asset }).pipe(map((v) => {
          const balance = v as unknown as SignedBalance;

          const miscFrozen = registry.createType('u128', 0);
          const feeFrozen = miscFrozen;
          const reserved = registry.createType('u128', 0);

          const free = balance?.isPositive
            ? balance.asPositive
            : registry.createType('u128', 0);

          return {
            feeFrozen, free, miscFrozen, reserved
          };
        })));
      } }
    };
  }, {})

};

export default definitions;
