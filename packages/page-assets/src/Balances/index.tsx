// Copyright 2017-2022 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo, AssetInfoComplete } from '../types';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Dropdown, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Account from './Account';
import useBalances from './useBalances';

interface Props {
  className?: string;
  infos?: AssetInfo[];
}

function Balances ({ className, infos = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [infoIndex, setInfoIndex] = useState(0);
  const [info, setInfo] = useState<AssetInfoComplete | null>(null);
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
      .filter((i): i is AssetInfoComplete => !!(i.details && i.metadata) && !i.details.supply.isZero())
      .sort((a, b) => a.id.cmp(b.id)),
    [infos]
  );

  const assetOptions = useMemo(
    () => completeInfos.map(({ id, metadata }, index) => ({
      text: `${metadata.name.toUtf8()} (${formatNumber(id)})`,
      value: index
    })),
    [completeInfos]
  );

  const siFormat = useMemo(
    (): [number, string] => info
      ? [info.metadata.decimals.toNumber(), info.metadata.symbol.toUtf8().toUpperCase()]
      : [0, 'NONE'],
    [info]
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
        empty={info && balances && t<string>('No accounts with balances found for the asset')}
        filter={assetOptions.length
          ? (
            <Dropdown
              isFull
              label={t<string>('the asset to query for balances')}
              onChange={setInfoIndex}
              options={assetOptions}
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
            assetId={info.id}
            key={accountId}
            minBalance={info.details.minBalance}
            siFormat={siFormat}
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
