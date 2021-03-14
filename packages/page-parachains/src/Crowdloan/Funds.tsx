// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { Option } from '@polkadot/types';
import type { FundIndex, FundInfo, ParaId } from '@polkadot/types/interfaces';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Fund from './Fund';

interface Props {
  bestNumber?: BN;
  className?: string;
  paraIds: FundIndex[];
}

interface FundState {
  info: FundInfo;
  paraId: ParaId;
}

function Funds ({ bestNumber, className, paraIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const optFunds = useCallMulti<Option<FundInfo>[]>(paraIds.map((id) => [api.query.crowdloan.funds, id]));

  const headerRef = useRef([
    [t('funds'), 'start', 4],
    [t('slots')],
    [t('cap')],
    [t('raised')],
    [t('end')],
    []
  ]);

  // we actually want to split this further info completed and ongoing
  const funds = useMemo(
    () => optFunds && paraIds.length === optFunds.length
      ? paraIds
        .map((paraId, i) => ({ info: optFunds[i].unwrapOr(null), paraId }))
        .filter((fund): fund is FundState => !!fund.info)
      : null,
    [optFunds, paraIds]
  );

  return (
    <Table
      className={className}
      empty={funds && t<string>('No campaigns found')}
      header={headerRef.current}
    >
      {funds?.map(({ info, paraId }) => (
        <Fund
          bestNumber={bestNumber}
          info={info}
          key={paraId.toString()}
          paraId={paraId}
        />
      ))}
    </Table>
  );
}

export default React.memo(Funds);
