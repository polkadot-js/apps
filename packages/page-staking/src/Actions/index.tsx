// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview, DeriveStakerReward } from '@polkadot/api-derive/types';
import { ActiveEraInfo, EraIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Button, Table } from '@polkadot/react-components';
import { useCall, useApi, useOwnStashes } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import Account from './Account';
import StartStaking from './NewStake';
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
    transform: (activeEra: Option<ActiveEraInfo>): EraIndex | undefined =>
      activeEra.isSome
        ? activeEra.unwrap().index
        : undefined
  });
  const ownStashes = useOwnStashes();
  const [isNewStakeOpen, setIsNewStateOpen] = useState(false);
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});

  useEffect((): void => {
    ownStashes && setFoundStashes(
      ownStashes.sort((a, b): number =>
        (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99)
      )
    );
  }, [ownStashes, stashTypes]);

  const _toggleNewStake = useCallback(
    (): void => setIsNewStateOpen(
      (isNewStakeOpen: boolean) => !isNewStakeOpen
    ),
    []
  );
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
      <Button.Group>
        <Button
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
            <Table.Head>
              <th colSpan={2}>&nbsp;</th>
              <th className='start'>{t('controller')}</th>
              <th colSpan={3}>&nbsp;</th>
            </Table.Head>
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
                  rewards={allRewards && allRewards[stashId]}
                  stakingOverview={stakingOverview}
                  stashId={stashId}
                />
              ))}
            </Table.Body>
          </Table>
        )
        : <div>{t('No funds staked yet. Bond funds to validate or nominate a validator.')}</div>
      }
    </div>
  );
}

export default React.memo(Actions);
