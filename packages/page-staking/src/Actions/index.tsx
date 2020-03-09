// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AccountId, ActiveEraInfo, EraIndex, StakingLedger } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useCall, useApi, useAccounts } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import Account from './Account';
import StartStaking from './NewStake';
import { useTranslation } from '../translate';

interface Props {
  allStashes: string[];
  className?: string;
  isVisible: boolean;
  recentlyOnline?: DerivedHeartbeats;
  next: string[];
  stakingOverview?: DerivedStakingOverview;
}

function getStashes (allAccounts: string[], stashTypes: Record<string, number>, queryBonded?: Option<AccountId>[], queryLedger?: Option<StakingLedger>[]): [string, boolean][] | null {
  const result: [string, boolean][] = [];

  if (!queryBonded || !queryLedger) {
    return null;
  }

  queryBonded.forEach((value, index): void => {
    value.isSome && result.push([allAccounts[index], true]);
  });

  queryLedger.forEach((ledger): void => {
    if (ledger.isSome) {
      const stashId = ledger.unwrap().stash.toString();

      !result.some(([accountId]): boolean => accountId === stashId) && result.push([stashId, false]);
    }
  });

  return result.sort((a, b): number =>
    (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99)
  );
}

export default function Actions ({ allStashes, className, isVisible, next, recentlyOnline, stakingOverview }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const activeEra = useCall<EraIndex | undefined>(api.query.staking.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>): EraIndex | undefined =>
      activeEra.isSome
        ? activeEra.unwrap().index
        : undefined
  });
  const queryBonded = useCall<Option<AccountId>[]>(api.query.staking.bonded.multi as any, [allAccounts]);
  const queryLedger = useCall<Option<StakingLedger>[]>(api.query.staking.ledger.multi as any, [allAccounts]);
  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});

  useEffect((): void => {
    setFoundStashes(getStashes(allAccounts, stashTypes, queryBonded, queryLedger));
  }, [allAccounts, queryBonded, queryLedger, stashTypes]);

  const _toggleNewStake = (): void => setIsNewStateOpen(!isNewStakeOpen);
  const _onUpdateType = (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other'): void =>
    setStashTypes({
      ...stashTypes,
      [stashId]: type === 'validator'
        ? 1
        : type === 'nominator'
          ? 5
          : 9
    });

  return (
    <div className={`${className} ${!isVisible && 'staking--hidden'}`}>
      <Button.Group>
        <Button
          isPrimary
          key='new-stake'
          label={t('New stake')}
          icon='add'
          onClick={_toggleNewStake}
        />
      </Button.Group>
      {isNewStakeOpen && (
        <StartStaking onClose={_toggleNewStake} />
      )}
      {foundStashes?.length
        ? (
          <Table>
            <Table.Body>
              {foundStashes.map(([stashId, isOwnStash]): React.ReactNode => (
                <Account
                  activeEra={activeEra}
                  allStashes={allStashes}
                  isOwnStash={isOwnStash}
                  isVisible={isVisible}
                  key={stashId}
                  next={next}
                  onUpdateType={_onUpdateType}
                  recentlyOnline={recentlyOnline}
                  stakingOverview={stakingOverview}
                  stashId={stashId}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : t('No funds staked yet. Bond funds to validate or nominate a validator.')
      }
    </div>
  );
}
