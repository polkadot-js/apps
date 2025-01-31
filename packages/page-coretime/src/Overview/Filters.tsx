// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { Button, Dropdown, Input } from '@polkadot/react-components';
import { useTranslation } from '../translate.js';
import { ChainInformation } from '@polkadot/react-hooks/types';
import {
    useSearchFilter,
    useTypeFilter,
    useBlocksSort
} from './filters/index.js';
type FilterType = 'search' | 'type' | 'blocks';

interface ActiveFilters {
    search: number[];
    type: number[];
}

interface Props {
    data: number[];
    chainInfo: Record<number, ChainInformation>;
    onFilter: (data: number[]) => void;
}

function Filters({ data: initialData, chainInfo, onFilter }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
        search: [],
        type: []
    });

    const { blocksSort, setBlocksSort, getNextSortState, resetSort, applyBlocksSort } = useBlocksSort({
        data: initialData,
        chainInfo,
        onFilter: (data) => handleFilter(data, 'blocks')
    });

    const { searchValue, onInputChange, resetSearch, applySearchFilter } = useSearchFilter({
        data: initialData,
        onFilter: (data) => handleFilter(data, 'search')
    });

    const { selectedType, onDropDownChange, typeOptions, resetType, applyTypeFilter } = useTypeFilter({
        data: initialData,
        chainInfo,
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
    }, [initialData, onFilter, activeFilters, blocksSort, chainInfo]);


    const resetAllFilters = useCallback(() => {
        resetSearch();
        resetType();
        resetSort();
        setActiveFilters({ search: [], type: [] });
        onFilter(initialData);
    }, [initialData, onFilter, resetSearch, resetType, resetSort]);

    const hasActiveFilters = searchValue || selectedType || blocksSort;

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
            <div style={{ minWidth: '250px' }}>
                <Input
                    className='full isSmall'
                    onChange={onInputChange}
                    placeholder={t('parachain id or name')}
                    value={searchValue}
                    label={t('Search')}
                    aria-label={t('Search by parachain id or name')}
                />
            </div>
            <Dropdown
                className='isSmall'
                onChange={onDropDownChange}
                options={typeOptions}
                label={t('type')}
                placeholder='select type'
                value={selectedType}
            />
            <div style={{ height: '20px' }}>
                <Button
                    icon={blocksSort ? (blocksSort === 'DESC' ? 'arrow-down' : 'arrow-up') : 'sort'}
                    onClick={() => setBlocksSort(getNextSortState(blocksSort))}
                    label={t('blocks')}
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