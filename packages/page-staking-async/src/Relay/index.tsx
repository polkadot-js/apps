// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ApiPromise } from '@polkadot/api';
import type { AppProps } from '@polkadot/react-components/types';
import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';

import React, { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import useSortedTargets from '@polkadot/app-staking/useSortedTargets';
import { Tabs } from '@polkadot/react-components';
import { useCallMulti, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';

import Actions from '../Actions/index.js';
import CommandCenter from '../CommandCenter/index.js';
import { STORE_FAVS_BASE } from '../constants.js';
import { useTranslation } from '../translate.js';

interface Props extends AppProps {
  ahApi?: ApiPromise
  rcApi?: ApiPromise
  isRelayChain: boolean
  rcEndPoints: string[]
  ahEndPoints: string[]
}

const OPT_MULTI = {
  defaultValue: [false, undefined, {}] as [boolean, BN | undefined, Record<string, boolean>],
  transform: ([eraElectionStatus, minValidatorBond, validators, activeValidatorIndices]: [ElectionStatus | null, BN | undefined, ValidatorId[] | null, ParaValidatorIndex[] | null]): [boolean, BN | undefined, Record<string, boolean>] => [
    !!eraElectionStatus && eraElectionStatus.isOpen,
    minValidatorBond && !minValidatorBond.isZero()
      ? minValidatorBond
      : undefined,
    validators && activeValidatorIndices
      ? activeValidatorIndices.reduce((all, index) => ({ ...all, [validators[index.toNumber()].toString()]: true }), {})
      : {}
  ]
};

function StakingApp ({ ahApi: api, ahEndPoints, basePath, isRelayChain, rcApi, rcEndPoints }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const [withLedger] = useState(false);
  const [favorites] = useFavorites(STORE_FAVS_BASE);
  const ownStashes = useOwnStashInfos(api);
  const targets = useSortedTargets(favorites, withLedger, api);
  const queries = useMemo(
    () => api
      ? [
        api.query.staking.eraElectionStatus,
        api.query.staking.minCommission,
        api.query.session.validators,
        (api.query.parasShared || api.query.shared)?.activeValidatorIndices
      ]
      : [],
    [api]
  );

  const [isInElection, minCommission] = useCallMulti<[boolean, BN | undefined, Record<string, boolean>]>(queries, OPT_MULTI);

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'actions',
      text: t('Accounts')
    },
    {
      name: 'command-center',
      text: t('Command Center')
    }
  ], [t]);

  return <>
    <Tabs
      basePath={basePath}
      items={items}
    />
    <Routes>
      <Route path={basePath}>
        <Route
          element={
            <CommandCenter
              ahApi={api}
              ahEndPoints={ahEndPoints}
              isRelayChain={isRelayChain}
              rcApi={rcApi}
              rcEndPoints={rcEndPoints}
            />
          }
          path='command-center'
        />
        <Route
          element={
            <Actions
              isInElection={isInElection}
              minCommission={minCommission}
              ownStashes={ownStashes}
              targets={targets}
            />
          }
          index
        />
      </Route>
    </Routes>
  </>;
}

export default React.memo(StakingApp);
