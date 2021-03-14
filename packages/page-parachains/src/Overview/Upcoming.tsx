// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Option, Vec } from '@polkadot/types';
import type { AccountId, BalanceOf, ParaGenesisArgs, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';

import React from 'react';

import { ParaLink } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from '../util';

interface Props {
  currentPeriod: BN | null;
  id: ParaId;
}

interface LeaseInfo {
  accountId: AccountId;
  balance: BalanceOf;
  period: number;
}

interface MultiState {
  leases: LeaseInfo[];
  upcomingGenesis: ParaGenesisArgs | null;
}

const optMulti = {
  defaultValue: {
    leases: [],
    upcomingGenesis: null
  },
  transform: ([optGenesis, leases]: [Option<ParaGenesisArgs>, Vec<Option<ITuple<[AccountId, BalanceOf]>>>]): MultiState => ({
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
    upcomingGenesis: optGenesis.unwrapOr(null)
  })
};

function Upcoming ({ currentPeriod, id }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { leases, upcomingGenesis } = useCallMulti<MultiState>([
    [api.query.paras.upcomingParasGenesis, id],
    [api.query.slots?.leases, id]
  ], optMulti);

  return (
    <tr key={id.toString()}>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge together'><ParaLink id={id} /></td>
      <td className='all start together hash'>
        {upcomingGenesis && (
          sliceHex(upcomingGenesis.genesisHead, 8)
        )}
      </td>
      <td className='start together'>
        {currentPeriod &&
          leases.map(({ period }) => formatNumber(currentPeriod.addn(period))).join(', ')
        }
      </td>
      <td className='number'>
        {upcomingGenesis && (
          upcomingGenesis.parachain ? t('Yes') : t('No')
        )}
      </td>
    </tr>
  );
}

export default React.memo(Upcoming);
