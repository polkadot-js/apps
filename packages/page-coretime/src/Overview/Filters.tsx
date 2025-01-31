// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation } from '@polkadot/react-hooks/types';

import React, { useCallback, useState } from 'react';

import { Button, Dropdown, Input } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { useBlocksSort, useSearchFilter, useTypeFilter } from './filters/index.js';

type FilterType = 'search' | 'type' | 'blocks';

interface ActiveFilters {
  search: number[];
  type: number[];
}

interface Props {
  chainInfo: Record<number, ChainInformation>;
  data: number[];
  onFilter: (data: number[]) => void;
}

function Filters ({ chainInfo, data: initialData, onFilter }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    search: [],
    type: []
  });

  const { applyBlocksSort, blocksSort, handleBlocksSortClick, resetSort } = useBlocksSort({
    chainInfo,
    data: initialData,
    onFilter: (data) => handleFilter(data, 'blocks')
  });

  const { applySearchFilter, onInputChange, resetSearch, searchValue } = useSearchFilter({
    data: initialData,
    onFilter: (data) => handleFilter(data, 'search')
  });

  const { applyTypeFilter, onDropDownChange, resetType, selectedType, typeOptions } = useTypeFilter({
    chainInfo,
    data: initialData,
    onFilter: (data) => handleFilter(data, 'type')
  });

  const handleFilter = useCallback((
    filteredData: number[],
    filterType: FilterType
  ): void => {
    let resultData = filteredData;

    if (filterType !== 'search') {
      resultData = applySearchFilter(resultData, activeFilters.search);
    }

    if (filterType !== 'type') {
      resultData = applyTypeFilter(resultData, activeFilters.type);
    }

    if (filterType !== 'blocks' && blocksSort) {
      resultData = applyBlocksSort(resultData, blocksSort);
    }

    if (filterType !== 'blocks') {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: filteredData.length === initialData.length ? [] : filteredData
      }));
    }

    onFilter(resultData);
  }, [initialData, onFilter, activeFilters, blocksSort, applyBlocksSort, applyTypeFilter, applySearchFilter]);

  const resetAllFilters = useCallback(() => {
    resetSearch();
    resetType();
    resetSort();
    setActiveFilters({ search: [], type: [] });
    onFilter(initialData);
  }, [initialData, onFilter, resetSearch, resetType, resetSort]);

  const hasActiveFilters = searchValue || selectedType || blocksSort;

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: '10px' }}>
      <div style={{ minWidth: '250px' }}>
        <Input
          aria-label={t('Search by parachain id or name')}
          className='full isSmall'
          label={t('Search')}
          onChange={onInputChange}
          placeholder={t('parachain id or name')}
          value={searchValue}
        />
      </div>
      <Dropdown
        className='isSmall'
        label={t('type')}
        onChange={onDropDownChange}
        options={typeOptions}
        placeholder='select type'
        value={selectedType}
      />
      <div style={{ height: '20px' }}>
        <Button
          icon={blocksSort ? (blocksSort === 'DESC' ? 'arrow-down' : 'arrow-up') : 'sort'}
          label={t('blocks')}
          onClick={handleBlocksSortClick}
        />
      </div>
      {hasActiveFilters && (
        <div style={{ height: '20px' }}>
          <Button
            icon='times'
            label={t('Reset filters')}
            onClick={resetAllFilters}
          />
        </div>
      )}
    </div>
  );
}

export default Filters;
