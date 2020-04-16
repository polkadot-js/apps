import { useState } from 'react';
import { useApi } from '@polkadot/react-hooks';
import { DeriveStakingElected, DeriveStakingQuery, DeriveAccountInfo } from '@polkadot/api-derive/types';

/**
 * Filter validators by judgements. Empty judgements discard.
 * @param {DeriveStakingElected} electedInfo
 * @param {(validatorsLoading: boolean) => void} setValidatorsLoading
 * @return {DeriveStakingElected} filtered validators
 */
function useValidatorsFilter(electedInfo?: DeriveStakingElected, setValidatorsLoading: (validatorsLoading: boolean) => void): DeriveStakingElected | null {
  const { api } = useApi();
  const [called, setCalled] = useState<boolean>(false);
  const [filtered, setFiltered] = useState<DeriveStakingElected | null>(null);

  if (electedInfo && electedInfo.info.length && !called) {
    setCalled(true);
    setValidatorsLoading(true);
    Promise.all(
      electedInfo.info.map((validator: DeriveStakingQuery) => manageAccountInfo(validator.accountId.toString()))
    ).then((addresses: Array<string | null>) => {
      const electedInfoFiltered = electedInfo.info.filter(validator => addresses.find(address => address === validator.accountId.toString()));
      setFiltered({
        info: electedInfoFiltered,
        nextElected: [],
      });
    });
  }

  function manageAccountInfo(address: string): Promise<string | null> {
    return getAccountInfo(address).then((item: DeriveAccountInfo) => {
      if (checkIdentity(item)) {
        return new Promise(resolve => {
          resolve(address);
        })
      } else if (item.identity.parent) {
        return getAccountInfo(item.identity.parent.toString()).then(val => {
          if (checkIdentity(item)) {
            return address;
          }
          return null;
        })
      }
      return new Promise(resolve => {
        resolve(null);
      })
      }
    )
  }

  function getAccountInfo(address: string): Promise<DeriveAccountInfo> {
    return api.derive.accounts.info(address);
  }

  function checkIdentity(value: DeriveAccountInfo): boolean {
    return value.identity.judgements && value.identity.judgements.length > 0
  }

  return filtered;
}

export default useValidatorsFilter;

