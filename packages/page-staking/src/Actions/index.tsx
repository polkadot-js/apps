// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActiveEraInfo, EraIndex } from '@polkadot/types/interfaces';

import React, { useCallback, useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { Table } from '@polkadot/react-components';
import { useCall, useApi, useOwnStashes } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import ElectionBanner from '../ElectionBanner';
import { useTranslation } from '../translate';
import Account from './Account';
import NewStake from './NewStake';

interface Props {
  allStashes?: string[];
  className?: string;
  isInElection?: boolean;
  next?: string[];
  validators?: string[];
}

function Actions ({ allStashes, className, isInElection, next, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeEra = useCall<EraIndex | undefined>(api.query.staking?.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>) => activeEra.unwrapOr({ index: undefined }).index
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
    <div className={className}>
      <NewStake />
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={t('No funds staked yet. Bond funds to validate or nominate a validator')}
        header={[
          [t('stashes'), 'start'],
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
            isDisabled={isInElection}
            isOwnStash={isOwnStash}
            key={stashId}
            next={next}
            onUpdateType={_onUpdateType}
            stashId={stashId}
            validators={validators}
          />
        ))}
      </Table>
      {api.query.staking.activeEra && (
        <Trans key='paymentMoved'>All applicable account payouts are now available on the <a href='#/staking/payout'>Payouts tab</a></Trans>
      )}
    </div>
  );
}

export default React.memo(Actions);
