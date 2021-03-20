// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, HeadData, ParaGenesisArgs, ParaId, ParaLifecycle } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeaseInfo, QueuedAction } from './types';

import React from 'react';

import { ParaLink } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { sliceHex } from '../util';
import Lifecycle from './Lifecycle';

interface Props {
  currentPeriod: BN | null;
  id: ParaId;
  nextAction?: QueuedAction;
}

interface MultiState {
  headHex: string | null;
  leases: LeaseInfo[];
  lifecycle: ParaLifecycle | null;
}

const optMulti = {
  defaultValue: {
    headHex: null,
    leases: [],
    lifecycle: null
  },
  transform: ([optHead, optGenesis, optLifecycle, leases]: [Option<HeadData>, Option<ParaGenesisArgs>, Option<ParaLifecycle>, Vec<Option<ITuple<[AccountId, BalanceOf]>>>]): MultiState => ({
    headHex: optHead.isSome
      ? sliceHex(optHead.unwrap())
      : optGenesis.isSome
        ? sliceHex(optGenesis.unwrap().genesisHead)
        : null,
    leases: leases
      ? leases
        .map((optLease, period): LeaseInfo | null => {
          if (optLease.isNone) {
            return null;
          }

          const [accountId, balance] = optLease.unwrap();

          return {
            accountId,
            balance,
            period
          };
        })
        .filter((item): item is LeaseInfo => !!item)
      : [],
    lifecycle: optLifecycle.unwrapOr(null)
  })
};

function Upcoming ({ currentPeriod, id, nextAction }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { headHex, leases, lifecycle } = useCallMulti<MultiState>([
    [api.query.paras.heads, id],
    [api.query.paras.upcomingParasGenesis, id],
    [api.query.paras.paraLifecycles, id],
    [api.query.slots?.leases, id]
  ], optMulti);

  return (
    <tr>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge together'><ParaLink id={id} /></td>
      <td className='start together hash'>{headHex}</td>
      <td className='start'>
        <Lifecycle
          lifecycle={lifecycle}
          nextAction={nextAction}
        />
      </td>
      <td className='all' />
      <td className='start together'>
        {currentPeriod &&
          leases.map(({ period }) => formatNumber(currentPeriod.addn(period))).join(', ')
        }
      </td>
    </tr>
  );
}

export default React.memo(Upcoming);
