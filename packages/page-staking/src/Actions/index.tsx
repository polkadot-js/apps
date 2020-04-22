// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActiveEraInfo, EraIndex } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { Table } from '@polkadot/react-components';
import { useCall, useApi, useOwnStashes } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
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

interface Balances {
  accounts: Record<string, BN>;
  bondedTotal?: BN;
}

function Actions ({ allStashes, className, isInElection, next, validators }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const activeEra = useCall<EraIndex | undefined>(api.query.staking?.activeEra, [], {
    transform: (activeEra: Option<ActiveEraInfo>) => activeEra.unwrapOr({ index: undefined }).index
  });
  const ownStashes = useOwnStashes();
  const [{ bondedTotal }, setBonded] = useState<Balances>({ accounts: {} });
  const [foundStashes, setFoundStashes] = useState<[string, boolean][] | null>(null);
  const [stashTypes, setStashTypes] = useState<Record<string, number>>({});

  useEffect((): void => {
    ownStashes && setFoundStashes(
      ownStashes.sort((a, b) => (stashTypes[a[0]] || 99) - (stashTypes[b[0]] || 99))
    );
  }, [ownStashes, stashTypes]);

  const _setBonded = useCallback(
    (account: string, bonded: BN) =>
      setBonded(({ accounts }: Balances): Balances => {
        accounts[account] = bonded;

        return {
          accounts,
          bondedTotal: Object.values(accounts).reduce((total: BN, value: BN) => total.add(value), new BN(0))
        };
      }),
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
    <div className={className}>
      <NewStake />
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={t('No funds staked yet. Bond funds to validate or nominate a validator')}
        footer={
          <tr>
            <td colSpan={3} />
            <td className='number'>
              {bondedTotal && <FormatBalance value={bondedTotal} />}
            </td>
            <td colSpan={2} />
          </tr>
        }
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
            setBonded={_setBonded}
            stashId={stashId}
            validators={validators}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Actions);
