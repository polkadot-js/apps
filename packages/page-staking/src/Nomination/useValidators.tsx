import {useEffect, useState} from 'react';
import BN from 'bn.js';
import {useAccounts, useApi, useCall, useDebounce, useFavorites} from '@polkadot/react-hooks/index';
import { DeriveStakingElected, DeriveSessionIndexes} from '@polkadot/api-derive/types';
import { Balance } from '@polkadot/types/interfaces';
import { SortBy, extractInfo, AllInfo, sort } from '@polkadot/app-staking/Targets';
import {STORE_FAVS_BASE} from "@polkadot/app-staking/constants";
import { Option } from '@polkadot/types';
import useValidatorsFilter from './useValidatorsFilter';

function useValidators () {
  const { api } = useApi();
  const [_amount] = useState<BN | undefined>(new BN(1_000));
  const { allAccounts } = useAccounts();
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, []);
  const [{ sortBy, sortFromMax }] = useState<{ sortBy: SortBy; sortFromMax: boolean }>({ sortBy: 'rankOverall', sortFromMax: true });
  const amount = useDebounce(_amount);
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const lastEra = useCall<BN>(api.derive.session.indexes as any, [], {
    defaultValue: new BN(0),
    transform: ({ activeEra }: DeriveSessionIndexes) =>
      activeEra.gtn(0) ? activeEra.subn(1) : new BN(0)
  }) || new BN(0);
  const lastReward = useCall<BN>(api.query.staking.erasValidatorReward, [lastEra], {
    transform: (optBalance: Option<Balance>) =>
      optBalance.unwrapOrDefault()
  });

  const [{ validators }, setWorkable] = useState<AllInfo>({ nominators: [], validators: [] });

  const filteredElected = useValidatorsFilter(electedInfo);

  useEffect((): void => {
    if (filteredElected && filteredElected.info) {
      const { nominators, totalStaked, validators } = extractInfo(allAccounts, amount, filteredElected, favorites, lastReward);
      const sorted = sort(sortBy, sortFromMax, validators);
      setWorkable({ nominators, totalStaked, sorted, validators });
    }
  }, [allAccounts, amount, electedInfo, favorites, lastReward, sortBy, sortFromMax, filteredElected]);

  return validators;
}

export default useValidators;
