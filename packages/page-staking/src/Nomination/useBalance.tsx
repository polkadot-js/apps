import {useApi, useCall} from "@polkadot/react-hooks/index";
import { DeriveBalancesAll } from '@polkadot/api-derive/types';
import { formatNumber } from '@polkadot/util';
import { Balance } from '@polkadot/types/interfaces/runtime';

// Known account we want to use (available on dev chain, with funds)

export function useBalance (address?: string | null): string | null  {
  const api = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all as any, [address]);
  return balancesAll ? formatNumber(balancesAll.freeBalance) : null
}

export function useBalanceClear (address?: string | null): Balance | null  {
  const api = useApi();
  const balancesAll = useCall<DeriveBalancesAll>(api.api.derive.balances.all as any, [address]);
  return balancesAll ? balancesAll.freeBalance : null
}

export default useBalance;
