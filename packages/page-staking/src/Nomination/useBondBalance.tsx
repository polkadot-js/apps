import {useApi, useCall} from "@polkadot/react-hooks/index";
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { formatNumber } from '@polkadot/util';

// Known account we want to use (available on dev chain, with funds)

function useBondBalance (address?: string | null) {
  const api = useApi();
  const stakingInfo = useCall<DeriveStakingAccount>(api.api.derive.staking.account as any, [address]);
  // const stackingBonded = useCall<DeriveStakingAccount>(api.api.query.stacking.bonded as any, [address]);
  // console.log('stackingBonded', stackingBonded);
  const balance = stakingInfo?.stakingLedger?.active.unwrap();
  return balance ? formatNumber(balance) : null;
}

export default useBondBalance;
