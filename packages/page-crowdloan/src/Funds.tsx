// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { FundIndex, FundInfo } from '@polkadot/types/interfaces';

import React, { useEffect, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCallMulti } from '@polkadot/react-hooks';

import Fund from './Fund';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  fundIndexes: FundIndex[];
}

interface Fund {
  id: FundIndex;
  info: FundInfo;
}

function Funds ({ className, fundIndexes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const optFunds = useCallMulti<Option<FundInfo>[]>(fundIndexes.map((id) => [api.query.crowdloan.funds, id]));
  const [funds, setFunds] = useState<Fund[] | undefined>();

  const headerRef = useRef([
    [t('campaigns'), 'start'],
    []
  ]);

  useEffect((): void => {
    optFunds && fundIndexes.length === optFunds.length && setFunds(
      fundIndexes
        .map((id, i) => ({ id, info: optFunds[i].unwrapOr(null) }))
        .filter((fund): fund is Fund => !!fund.info)
    );
  }, [fundIndexes, optFunds]);

  return (
    <Table
      className={className}
      empty={funds && t<string>('No campaigns found')}
      header={headerRef.current}
    >
      {funds?.map(({ id, info }) => (
        <Fund
          id={id}
          info={info}
          key={id.toString()}
        />
      ))}
    </Table>
  );
}

export default React.memo(Funds);
