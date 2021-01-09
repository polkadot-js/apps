import React, { useState, useEffect } from 'react';
import { useApi } from '@polkadot/react-hooks';
import Accounts from '../Accounts';
import { useTranslation } from '../translate';
import { bnToBn } from '@polkadot/util';
import BN from 'bn.js';

import { getQuery, accountToPolkadot } from '../apollo-helpers';
import gql from 'graphql-tag';

const VALIDATORS_QUERY = gql`
  query validator {
    validator(
      order_by: { rank: asc }
    ) {
      account_id
      stash_id
      commission
      next_elected
      exposure_others
      exposure_own
      exposure_total
      produced_blocks
      rank
    }
  }
`;

// TODO: this implementation will crawl all validator stats for each epoch
// on page load, it's not efficient or scaleable and needs to be reworked to exist on the be
// be currently doesnt crawl epochs, the epochs listing page can also benefit from this
// but it will take some time to achieve
function ValidatorsList (): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();
  const [ accounts, setAccounts ] = useState([]);
  const [ accountsData, accountsError ] = getQuery(VALIDATORS_QUERY);
  const headers = [
    [t('validators'), 'start', 4],
    [t('total locked rewards')],
    [t('total unlocked rewards')],
    [t('produced blocks'), 'expand'],
  ];

  async function getStatsForEpoch(epochId, rewards) {
    const validatorStats = await api.query.poAModule.validatorStats.entries(epochId);
    for (let i = 0; i < validatorStats.length; i++) {
      const element = validatorStats[i];
        const hasReward = element[1].locked_reward.isSome;
        const validatorArgs = element[0].toHuman();
        const validatorId = validatorArgs[1];

        if (hasReward) {
          const locked = element[1].locked_reward.unwrap();
          const unlocked = element[1].unlocked_reward.unwrap();

          if (!rewards[validatorId]) {
            rewards[validatorId] = {
              locked: locked,
              unlocked: unlocked,
            };
          } else {
            rewards[validatorId].locked = rewards[validatorId].locked.add(locked);
            rewards[validatorId].unlocked = rewards[validatorId].unlocked.add(unlocked);
          }
        }
    }
    return rewards;
  }

  async function loadValidatorStats() {
    const rewards = {};
    const currentEpoch = await api.query.poAModule.epoch();

    const promises = [];
    for (let epochId = 1; epochId <= currentEpoch; epochId++) {
      promises.push(getStatsForEpoch(epochId, rewards));
    }

    await Promise.all(promises);
    return rewards;
  }

  function mapAccountToRewards(account, rewards) {
    const address = account.account.toString();
    const validator = rewards[address];
    if (validator) {
      account.locked_reward = validator.locked;
      account.unlocked_reward = validator.unlocked;
    }
    return account;
  }

  async function loadData() {
    const validatorRewards = await loadValidatorStats();
    const accounts = accountsData.validator.map((d) => mapAccountToRewards(accountToPolkadot(d, api), validatorRewards));
    setAccounts(accounts);
  }

  useEffect(() => {
    if (accountsData) {
      loadData();
    }
  }, [accountsData]);

  return (
    <Accounts headers={accounts} tableHeaders={headers} useComplex={false} />
  );
}

export default React.memo(ValidatorsList);
