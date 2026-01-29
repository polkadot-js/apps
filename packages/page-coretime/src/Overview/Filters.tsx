// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation } from '@polkadot/react-hooks/types';
import type { ActiveFilters } from '../types.js';

import React, { useCallback, useState } from 'react';

import { Button, Dropdown, Input } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { FilterType, useBlocksSort, useSearchFilter, useTypeFilter } from './filters/index.js';

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

  const { apply: applyBlocksSort, direction, onApply: onApplySort, reset: resetSort } = useBlocksSort({
    chainInfo,
    data: initialData,
    onFilter: (data) => handleFilter(data, FilterType.BLOCKS)
  });

  const { apply: applySearchFilter, onApply: onApplySearch, reset: resetSearch, searchValue } = useSearchFilter({
    data: initialData,
    onFilter: (data) => handleFilter(data, FilterType.SEARCH)
  });

  const { apply: applyTypeFilter, onApply: onApplyType, reset: resetType, selectedType, typeOptions } = useTypeFilter({
    chainInfo,
    data: initialData,
    onFilter: (data) => handleFilter(data, FilterType.TYPE)
  });

  /**
   * 1. Applies additional filtering already present in the filters
   * 2. Performs filtering based on the filter type
   */
  const handleFilter = useCallback((
    filteredData: number[],
    filterType: FilterType
  ): void => {
    let resultData = filteredData;

    if (filterType !== FilterType.SEARCH) {
      resultData = applySearchFilter(resultData, activeFilters.search);
    }

    if (filterType !== FilterType.TYPE) {
      resultData = applyTypeFilter(resultData, activeFilters.type);
    }

    if (filterType !== FilterType.BLOCKS && direction) {
      resultData = applyBlocksSort(resultData, direction);
    }

    if (filterType !== FilterType.BLOCKS) {
      setActiveFilters((prev) => ({
        ...prev,
        [filterType]: filteredData.length === initialData.length ? [] : filteredData
      }));
    }

    onFilter(resultData);
  }, [initialData, onFilter, activeFilters, direction, applyBlocksSort, applyTypeFilter, applySearchFilter]);

  const resetAllFilters = useCallback(() => {
    resetSearch();
    resetType();
    resetSort();
    setActiveFilters({ search: [], type: [] });
    onFilter(initialData);
  }, [initialData, onFilter, resetSearch, resetType, resetSort]);

  const hasActiveFilters = searchValue || selectedType || direction;

  return (
    <div style={{ alignItems: 'center', display: 'flex', flexDirection: 'row', gap: '10px' }}>
      <div style={{ minWidth: '250px' }}>
        <Input
          aria-label={t('Search by parachain id or name')}
          className='full isSmall'
          label={t('Search')}
          onChange={onApplySearch}
          placeholder={t('parachain id or name')}
          value={searchValue}
        />
      </div>
      <Dropdown
        className='isSmall'
        label={t('type')}
        onChange={onApplyType}
        options={typeOptions}
        placeholder='select type'
        value={selectedType}
      />
      <div style={{ height: '20px' }}>
        <Button
          icon={direction ? (direction === 'DESC' ? 'arrow-up' : 'arrow-down') : 'sort'}
          label={t('blocks')}
          onClick={onApplySort}
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
