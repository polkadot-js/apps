// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview, DeriveStakerReward } from '@polkadot/api-derive/types';
import { ActiveEraInfo, ElectionStatus, EraIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useCall, useApi, useOwnStashes } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import Account from './Account';
import NewStake from './NewStake';
import { useTranslation } from '../translate';

interface Props {
  allRewards?: Record<string, DeriveStakerReward[]>;
  allStashes?: string[];
  className?: string;
  isVisible: boolean;
  next?: string[];
  stakingOverview?: DeriveStakingOverview;
}

function Actions ({ allRewards, allStashes, className, isVisible, next, stakingOverview }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeEra = useCall<EraIndex | undefined>(api.query.staking?.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>) => activeEra.unwrapOr({ index: undefined }).index
  });
  const isInElection = useCall<boolean>(api.query.staking?.eraElectionStatus, [], {
    transform: (status: ElectionStatus) => status.isOpen
  });
  const ownStashes = useOwnStashes();
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});

  useEffect((): void => {
    ownStashes && setFoundStashes(
      ownStashes.sort((a, b): number =>
        (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99)
      )
    );
  }, [ownStashes, stashTypes]);

  const _onUpdateType = useCallback(
    (stashId: string, type: 'validator' | 'nominator' | 'started' | 'other'): void =>
      setStashTypes((stashTypes: Record<string, number>) => ({
        ...stashTypes,
        [stashId]: type === 'validator'
          ? 1
          : type === 'nominator'
            ? 5
            : 9
      })),
    []
  );

  return (
    <div className={`${className} ${!isVisible && 'staking--hidden'}`}>
      <NewStake isInElection={isInElection} />
      {isInElection && (
        <article className='warning nomargin'>
          {t('There is currently an ongoing election for new validator candidates. As such staking operations are not permitted.')}
        </article>
      )}
      <Table
        empty={t('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={[
          [t('stashes'), 'start', 2],
          [t('controller'), 'address'],
          [t('rewards'), 'number'],
          [t('bonded'), 'number'],
          [undefined, undefined, 2]
        ]}
      >
        {foundStashes?.map(([stashId, isOwnStash]): React.ReactNode => (
          <Account
            activeEra={activeEra}
            allStashes={allStashes}
            isInElection={isInElection}
            isOwnStash={isOwnStash}
            key={stashId}
            next={next}
            onUpdateType={_onUpdateType}
            rewards={allRewards && allRewards[stashId]}
            stakingOverview={stakingOverview}
            stashId={stashId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Actions);
