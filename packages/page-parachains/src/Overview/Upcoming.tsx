// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, HeadData, ParaGenesisArgs, ParaId, ParaInfo, ParaLifecycle } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeasePeriod } from '../types';
import type { LeaseInfo, QueuedAction } from './types';

import React from 'react';

import { AddressSmall, ParaLink } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from '../util';
import LeaseBlocks from './LeaseBlocks';
import Lifecycle from './Lifecycle';

interface Props {
  id: ParaId;
  leasePeriod: LeasePeriod | null;
  nextAction?: QueuedAction;
}

interface MultiState {
  headHex: string | null;
  leases: LeaseInfo[] | null;
  lifecycle: ParaLifecycle | null;
  manager: AccountId | null;
}

const optMulti = {
  defaultValue: {
    headHex: null,
    leases: null,
    lifecycle: null,
    manager: null
  },
  transform: ([optHead, optGenesis, optLifecycle, optInfo, leases]: [Option<HeadData>, Option<ParaGenesisArgs>, Option<ParaLifecycle>, Option<ParaInfo>, Vec<Option<ITuple<[AccountId, BalanceOf]>>>]): MultiState => ({
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
    lifecycle: optLifecycle.unwrapOr(null),
    manager: optInfo.isSome
      ? optInfo.unwrap().manager
      : null
  })
};

function Upcoming ({ id, leasePeriod, nextAction }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { headHex, leases, lifecycle, manager } = useCallMulti<MultiState>([
    [api.query.paras.heads, id],
    [api.query.paras.upcomingParasGenesis, id],
    [api.query.paras.paraLifecycles, id],
    [api.query.registrar?.paras, id],
    [api.query.slots?.leases, id]
  ], optMulti);

  return (
    <tr>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge'><ParaLink id={id} /></td>
      <td className='address'>{manager && <AddressSmall value={manager} />}</td>
      <td className='start together hash'>{headHex}</td>
      <td className='start'>
        <Lifecycle
          lifecycle={lifecycle}
          nextAction={nextAction}
        />
      </td>
      <td className='all number together'>
        {leasePeriod && leasePeriod.currentPeriod && leases && (
          leases.length
            ? (
              <>
                <div>{leases.map(({ period }) => formatNumber(leasePeriod.currentPeriod.addn(period))).join(', ')}</div>
                <LeaseBlocks
                  leasePeriod={leasePeriod}
                  value={leases[0]?.period}
                />
              </>
            )
            : t('None')
        )}
      </td>
    </tr>
  );
}

export default React.memo(Upcoming);
