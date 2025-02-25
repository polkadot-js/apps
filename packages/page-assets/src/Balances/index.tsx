// Copyright 2017-2025 @polkadot/app-assets authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AssetInfo, AssetInfoComplete } from '@polkadot/react-hooks/types';

import React, { useCallback, useMemo, useRef, useState } from 'react';

import { Input, styled, Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Asset from './Asset.js';

interface Props {
  className?: string;
  infos?: AssetInfo[];
}

function Balances ({ className, infos = [] }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [{ searchValue }, onApplySearch] = useState({ searchValue: '' });

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('asset'), 'start'],
    [t('accounts'), 'start'],
    [t('frozen'), 'start'],
    [t('sufficient'), 'start'],
    [t('free balance'), 'start'],
    []
  ]);

  const onChangeInput = useCallback((e: string) => {
    onApplySearch({ searchValue: e });
  }, []);

  const completeAssets = useMemo(
    () => infos
      .filter((i): i is AssetInfoComplete => !!(i.details && i.metadata) && !i.details.supply.isZero())
    ,
    [infos]
  );

  return (
    <StyledDiv className={className}>
      <Input
        aria-label={t('Search by asset id or name')}
        className='full isSmall'
        label={t('Search')}
        onChange={onChangeInput}
        placeholder={t('Search by asset id or name')}
        value={searchValue}
      />
      <Table
        empty={t('No accounts with balances found for the asset')}
        header={headerRef.current}
      >
        {completeAssets.map((asset) => {
          return (
            <Asset
              asset={asset}
              key={asset.id.toString()}
              searchValue={searchValue.toLowerCase()}
            />
          );
        })}
      </Table>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  input {
    max-width: 250px !important;
  }

  table {
    overflow: auto;
  }
`;

export default React.memo(Balances);
