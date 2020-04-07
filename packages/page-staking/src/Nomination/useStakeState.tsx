import {useEffect, useState} from 'react';
import {useAccounts, useApi, useCall} from '@polkadot/react-hooks/index';
import {getStakeState} from '@polkadot/app-staking/Actions/Account';
import { DeriveStakingAccount} from '@polkadot/api-derive/types';
import { ValidatorPrefs } from '@polkadot/types/interfaces';
import { Codec, ITuple } from '@polkadot/types/types';

type ValidatorInfo = ITuple<[ValidatorPrefs, Codec]> | ValidatorPrefs;

interface localStakeState {
  controllerId: string | null;
  isStashNominating: boolean;
  isStashValidating: boolean;
}

function useStakeState (stashId: string, allStashes: string[]) {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const stakingAccount = useCall<DeriveStakingAccount>(api.derive.staking.account as any, [stashId]);
  const validateInfo = useCall<ValidatorInfo>(api.query.staking.validators, [stashId]);
  const [{ controllerId, isStashNominating, isStashValidating }, setStakeState] = useState<localStakeState>({ controllerId: null, isStashNominating: false, isStashValidating: false });
  const [stashType, setStashType] = useState();

  useEffect((): void => {
    if (stakingAccount && validateInfo) {
      const state = getStakeState(allAccounts, allStashes, stakingAccount, stashId, validateInfo);
      setStakeState(state);

      if (state.isStashValidating) {
        setStashType('validator');
      } else if (state.isStashNominating) {
        setStashType('nominator');
      } else {
        setStashType('other');
      }
    }
  }, [allAccounts, allStashes, stakingAccount, stashId, validateInfo]);

  return { controllerId, isStashNominating, isStashValidating, stashType };
}

export default useStakeState;
