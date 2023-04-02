// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

// structs need to be in order
/* eslint-disable sort-keys */

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { Balance } from '@polkadot/types/interfaces';
import type { FrameSystemAccountInfo } from '@polkadot/types/lookup';
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { combineLatest, map } from 'rxjs';

import { memo } from '@polkadot/api-derive/util';
import { TypeRegistry, U128 } from '@polkadot/types';
import { BN } from '@polkadot/util';

function balanceOf (number: number | string): U128 {
  return new U128(new TypeRegistry(), number);
}

function defaultAccountBalance (): DeriveBalancesAll {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return {
    accountNonce: new BN(1),
    additional: [],
    availableBalance: balanceOf(0),
    freeBalance: balanceOf(0),
    lockedBalance: balanceOf(0),
    lockedBreakdown: [],
    namedReserves: [],
    reservedBalance: balanceOf(0),
    vestingLocked: balanceOf(0)
  } as any;
}

interface OrmlAccountData {
  free: Balance,
  reserved: Balance,
  frozen: Balance,
}

export function getBalance (
  instanceId: string,
  api: ApiInterfaceRx
): () => Observable<DeriveBalancesAll> {
  return memo(
    instanceId,
    (account: string): Observable<DeriveBalancesAll> =>
      combineLatest<[any, any]>([api.query.tokens.accounts(account, 0), api.query.system.account(account)]).pipe(
        map(([data, systemAccount]: [OrmlAccountData, FrameSystemAccountInfo]): DeriveBalancesAll => {
          return {
            ...defaultAccountBalance(),
            accountId: api.registry.createType('AccountId', account),
            accountNonce: systemAccount.nonce,
            availableBalance: api.registry.createType('Balance', data.free.sub(data.frozen)),
            freeBalance: data.free,
            lockedBalance: data.frozen,
            reservedBalance: data.reserved
          };
        })
      )
  );
}

const definitions: OverrideBundleDefinition = {
  derives: {
    balances: {
      account: getBalance,
      all: getBalance
    }
  },
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        ShufflingSeed: {
          seed: 'H256',
          proof: 'H512'
        },
        Header: {
          parentHash: 'Hash',
          number: 'Compact<BlockNumber>',
          stateRoot: 'Hash',
          extrinsicsRoot: 'Hash',
          digest: 'Digest',
          seed: 'ShufflingSeed',
          count: 'BlockNumber'
        },
        XYKRpcResult: {
          price: 'Balance'
        },
        RPCAmountsResult: {
          firstAssetAmount: 'Balance',
          secondAssetAmount: 'Balance'
        },
        VestingInfo: {
          locked: 'Balance',
          perBlock: 'Balance',
          startingBlock: 'BlockNumber'
        },
        TokenId: 'u32',
        VestingInfosWithLockedAt: {
          vestingInfosWithLockedAt: 'Vec<(VestingInfo<Balance, BlockNumber>, Balance)>'
        }
      }
    }
  ],
  rpc: {
    xyk: {
      calculate_buy_price: {
        description: '',
        params: [
          {
            name: 'input_reserve',
            type: 'Balance'
          },
          {
            name: 'output_reserve',
            type: 'Balance'
          },
          {
            name: 'sell_amount',
            type: 'Balance'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      calculate_sell_price: {
        description: '',
        params: [
          {
            name: 'input_reserve',
            type: 'Balance'
          },
          {
            name: 'output_reserve',
            type: 'Balance'
          },
          {
            name: 'sell_amount',
            type: 'Balance'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      get_burn_amount: {
        description: '',
        params: [
          {
            name: 'first_asset_id',
            type: 'TokenId'
          },
          {
            name: 'second_asset_id',
            type: 'TokenId'
          },
          {
            name: 'liquidity_asset_amount',
            type: 'Balance'
          }
        ],
        type: 'RPCAmountsResult<Balance>'
      },
      calculate_sell_price_id: {
        description: '',
        params: [
          {
            name: 'sold_token_id',
            type: 'TokenId'
          },
          {
            name: 'bought_token_id',
            type: 'TokenId'
          },
          {
            name: 'sell_amount',
            type: 'Balance'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      calculate_buy_price_id: {
        description: '',
        params: [
          {
            name: 'sold_token_id',
            type: 'TokenId'
          },
          {
            name: 'bought_token_id',
            type: 'TokenId'
          },
          {
            name: 'buy_amount',
            type: 'Balance'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      calculate_rewards_amount: {
        description: '',
        params: [
          {
            name: 'user',
            type: 'AccountId'
          },
          {
            name: 'liquidity_asset_id',
            type: 'TokenId'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      calculate_balanced_sell_amount: {
        description: '',
        params: [
          {
            name: 'total_amount',
            type: 'Balance'
          },
          {
            name: 'reserve_amount',
            type: 'Balance'
          }
        ],
        type: 'XYKRpcResult<Balance>'
      },
      get_max_instant_unreserve_amount: {
        description: '',
        params: [
          {
            name: 'user',
            type: 'AccountId'
          },
          {
            name: 'liquidity_asset_id',
            type: 'TokenId'
          }
        ],
        type: 'Balance'
      },
      get_max_instant_burn_amount: {
        description: '',
        params: [
          {
            name: 'user',
            type: 'AccountId'
          },
          {
            name: 'liquidity_asset_id',
            type: 'TokenId'
          }
        ],
        type: 'Balance'
      },
      get_vesting_locked_at: {
        description: '',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'token_id',
            type: 'TokenId'
          }
        ],
        type: 'VestingInfosWithLockedAt<Balance, BlockNumber>'
      }
    }
  }
};

export default definitions;
