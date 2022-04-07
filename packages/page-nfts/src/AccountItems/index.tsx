// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CollectionInfo, CollectionInfoComplete } from '../types';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Dropdown, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Item from './Item';
import useAccountItems from './useAccountItems';
import useItemsInfos from './useItemsInfos';

interface Props {
  className?: string;
  infos?: CollectionInfo[];
}

function AccountItems ({ className, infos = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const NO_NAME = ` - ${t('no name')} -`;

  const [infoIndex, setInfoIndex] = useState(0);
  const [info, setInfo] = useState<CollectionInfoComplete | null>(null);
  const accountItems = useAccountItems();

  const collectionItems = useMemo(
    () => !info || !accountItems
      ? []
      : accountItems.filter(({ collectionId }) => collectionId.eq(info.id))
    , [info, accountItems]
  );

  const itemsInfos = useItemsInfos(collectionItems);
  const collectionName = info?.ipfsData?.name || NO_NAME;

  const completeInfos = useMemo(
    () => !accountItems
      ? []
      : infos
        .filter((i): i is CollectionInfoComplete => !!(i.details && i.metadata) && accountItems.some(({ collectionId }) => i.id.eq(collectionId)))
        .sort((a, b) => a.id.cmp(b.id)),
    [infos, accountItems]
  );

  const collectionOptions = useMemo(
    () => completeInfos.map(({ id, ipfsData }, index) => ({
      text: `${ipfsData?.name || NO_NAME} (ID: ${formatNumber(id)})`,
      value: index
    })),
    [completeInfos, NO_NAME]
  );

  const headerRef = useRef([
    [t('items'), 'start', 2],
    [t('owner'), 'address media--1000']
  ]);

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
        empty={!info && accountItems && t<string>('No accounts with items found for the collection')}
        filter={collectionOptions.length
          ? (
            <Dropdown
              isFull
              label={t<string>('the collection to query for items')}
              onChange={setInfoIndex}
              options={collectionOptions}
              value={infoIndex}
            />
          )
          : undefined
        }
        header={headerRef.current}
      >
        {itemsInfos && itemsInfos.map((info) => (
          <Item
            collectionName={collectionName}
            key={info.key}
            value={info}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(styled(AccountItems)`
  table {
    overflow: auto;
  }
`);
