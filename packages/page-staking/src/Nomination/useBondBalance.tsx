import {useApi, useCall} from "@polkadot/react-hooks/index";
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { formatNumber } from '@polkadot/util';

// Known account we want to use (available on dev chain, with funds)

function useBondBalance (address?: string | null) {
  const api = useApi();
  const stakingInfo = useCall<DeriveStakingAccount>(api.api.derive.staking.account as any, [address]);
  console.log('stakingInfo', stakingInfo);
  const balance = stakingInfo?.stakingLedger?.active.unwrap();
  return balance ? formatNumber(balance) : null;
}

export default useBondBalance;
