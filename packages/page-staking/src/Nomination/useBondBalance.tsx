import {useApi, useCall} from "@polkadot/react-hooks/index";
import { DeriveStakingAccount } from '@polkadot/api-derive/types';
import { formatNumber } from '@polkadot/util';
import { calcBonded } from '@polkadot/react-components';

// Known account we want to use (available on dev chain, with funds)

function useBondBalance (address?: string | null) {
  const api = useApi();
  const stakingInfo = useCall<DeriveStakingAccount>(api.api.derive.staking.account as any, [address]);
  const [ownBonded, otherBonded] = calcBonded(stakingInfo, true);
  return ownBonded ? formatNumber(ownBonded) : null;
}

export default useBondBalance;
