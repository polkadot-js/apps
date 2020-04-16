import { useState } from 'react';
import { useApi } from '@polkadot/react-hooks/index';
import { DeriveStakingElected } from '@polkadot/api-derive/types';

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
    Promise.all(electedInfo.info.map(validator => api.derive.accounts.info(validator.accountId.toString()))).then(values => {
      const identitiesFiltered = values
        .filter(val => val.identity.judgements && val.identity.judgements.length > 0)
        .map(item => item?.accountId.toString());
      const validatorsFiltered = electedInfo.info.filter(validator => identitiesFiltered.find(item => item === validator.accountId.toString()));
      setFiltered({
        info: validatorsFiltered,
        nextElected: [],
      });
      /*if (api.query.identity?.identityOf) {
        api.query.identity.identityOf(validators[0].key).then(res => console.log('res', res));
      }*/
    });
  }
  return filtered;
}

export default useValidatorsFilter;

