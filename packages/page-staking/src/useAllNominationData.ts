import { useEffect, useState } from "react";
import {useAccounts, useApi} from '@polkadot/react-hooks'

export interface boundedChunks {
  lockedUntil: string;
  value: string;
}

export interface Nomination {
  validatorId: string;
  account: string;
  nomination: string;
  lastVoteWeight: string;
  lastVoteWeightUpdate: string;
  unbondedChunks: boundedChunks[];
}

export interface Dividended {
  validator: string;
  interest: string;
}

export interface UserInterest {
  account: string;
  interests: Dividended[];
}

type UseAllNominationData = {
  data: { ownNominations: Nomination[]; ownDividended: UserInterest[]; account: string }[]
  loading: boolean
  refetch: () => Promise<void>
}

export const useAllNominationData = (): UseAllNominationData => {
  const { api } = useApi()
  const { allAccounts } = useAccounts()
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<{ ownNominations: Nomination[]; ownDividended: UserInterest[]; account: string }[]>([])

  console.log('data', data)
  async function getAllNominationAndDivided() {
    try {
      setLoading(true);
      const result = await Promise.all(allAccounts.map(async (account: string) => {
        const ownNominations: any[] = [];
        const ownDividended: any[] = [];
        const res = await api.rpc.xstaking.getNominationByAccount(account);
        let currentNomination: any = {};
        // 该用户的所有投票
        const userNominations = res.toJSON();

        Object.keys(userNominations).forEach((key: string) => {
          currentNomination = userNominations[key];
          currentNomination = Object.assign(currentNomination, {
            validatorId: key
          });
          currentNomination = Object.assign(currentNomination, { account });
          ownNominations.push(currentNomination);
        });
        const userDividedRes = await api.rpc.xstaking.getDividendByAccount(account);

        let current: any = {};
        const dividedArray: any[] = [];
        const userDivided = JSON.parse(userDividedRes);

        Object.keys(userDivided).forEach((key: string) => {
          current = {
            validator: key,
            interest: userDivided[key]
          };
          dividedArray.push(current);
        });

        const userInterest = {
          account,
          interests: dividedArray
        };

        ownDividended.push(userInterest);
        return {
          account,
          ownNominations,
          ownDividended,
        }
      }))
      setData(result)
    } catch (e){
      console.log('getAllNominationAndDivided error', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect((): void => {
    allAccounts.length > 0 && getAllNominationAndDivided();
  }, [allAccounts]);

  return { data, loading, refetch: getAllNominationAndDivided }
}
