// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, HeadData, ParaId, ParaLifecycle } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeaseInfo, QueuedAction } from './types';

import BN from 'bn.js';
import React from 'react';

import { ParaLink } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { sliceHex } from '../util';
import Lifecycle from './Lifecycle';

interface Props {
  className?: string;
  currentPeriod: BN | null;
  id: ParaId;
  nextAction?: QueuedAction;
}

type QueryResult = [Option<HeadData>, Option<ParaLifecycle>, Vec<Option<ITuple<[AccountId, BalanceOf]>>>];

interface QueryState {
  headHex: string | null;
  leases: LeaseInfo[];
  lifecycle: ParaLifecycle | null;
}

const optionsMulti = {
  defaultValue: {
    headHex: null,
    leases: [],
    lifecycle: null
  },
  transform: ([headData, optLifecycle, leases]: QueryResult): QueryState => ({
    headHex: headData.isSome
      ? sliceHex(headData.unwrap())
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

function Parachain ({ className = '', currentPeriod, id, nextAction }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const paraInfo = useCallMulti<QueryState>([
    [api.query.paras.heads, id],
    [api.query.paras.paraLifecycles, id],
    [api.query.slots?.leases, id]
  ], optionsMulti);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge together'><ParaLink id={id} /></td>
      <td className='start together hash'>{paraInfo.headHex}</td>
      <td className='start media--1100'>
        <Lifecycle
          lifecycle={paraInfo.lifecycle}
          nextAction={nextAction}
        />
      </td>
      <td className='all' />
      <td className='start together'>
        {currentPeriod &&
          paraInfo.leases.map(({ period }) => formatNumber(currentPeriod.addn(period))).join(', ')
        }
      </td>
    </tr>
  );
}

export default React.memo(Parachain);
