// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { UniqueInfo, UniqueInfoComplete } from '../types';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Dropdown, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Account from './Account';
import useBalances from './useBalances';

interface Props {
  className?: string;
  infos?: UniqueInfo[];
}

function Balances ({ className, infos = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [infoIndex, setInfoIndex] = useState(0);
  const [info, setInfo] = useState<UniqueInfoComplete | null>(null);
  const balances = useBalances(info?.id);

  const headerRef = useRef([
    [t('accounts'), 'start'],
    [t('frozen'), 'start'],
    [t('sufficient'), 'start'],
    [],
    []
  ]);

  const completeInfos = useMemo(
    () => infos
      .filter((i): i is UniqueInfoComplete => !!(i.details && i.metadata) && !i.details.supply.isZero())
      .sort((a, b) => a.id.cmp(b.id)),
    [infos]
  );

  const uniqueOptions = useMemo(
    () => completeInfos.map(({ id, metadata }, index) => ({
      text: `${formatNumber(id)}`,
      value: index
    })),
    [completeInfos]
  );

  useEffect((): void => {
    setInfo(() =>
      infoIndex >= 0 && infoIndex < completeInfos.length
        ? completeInfos[infoIndex]
        : null
    );
  }, [completeInfos, infoIndex]);

  return (
    <div className={className}>
      <Table
        empty={info && balances && t<string>('No accounts with instances found for the unique class')}
        filter={uniqueOptions.length
          ? (
            <Dropdown
              isFull
              label={t<string>('the unique to query for instances')}
              onChange={setInfoIndex}
              options={uniqueOptions}
              value={infoIndex}
            />
          )
          : undefined
        }
        header={headerRef.current}
      >
        {info && balances?.map(({ account, accountId }) => (
          <Account
            account={account}
            accountId={accountId}
            uniqueId={info.id}
            key={accountId}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(Balances)`
  table {
    overflow: auto;
  }
`);
