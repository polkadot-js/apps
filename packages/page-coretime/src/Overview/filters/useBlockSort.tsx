// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { ChainInfoFilterProps, SortDirection } from '../../types.js';
import { ChainInformation } from '@polkadot/react-hooks/types';

export function sortByBlocks(data: number[], chainInfo: Record<number, ChainInformation>, direction: SortDirection): number[] {
    if (!data || !chainInfo || !direction) {
        return data || [];
    }

    return [...data].sort((a, b) => {
        const aInfo = chainInfo[a]?.workTaskInfo[0];
        const bInfo = chainInfo[b]?.workTaskInfo[0];

        if (!aInfo) return direction === 'DESC' ? 1 : -1;
        if (!bInfo) return direction === 'DESC' ? -1 : 1;

        return direction === 'DESC'
            ? bInfo.lastBlock - aInfo.lastBlock
            : aInfo.lastBlock - bInfo.lastBlock;
    });
}

export function useBlocksSort({ data, chainInfo, onFilter }: ChainInfoFilterProps) {
    const [blocksSort, setBlocksSort] = useState<SortDirection>('');

    const applyBlocksSort = useCallback((data: number[], sort: SortDirection): number[] => {
        return sort
            ? sortByBlocks(data, chainInfo, sort)
            : data;
    }, [chainInfo]);

    const getNextSortState = useCallback((current: SortDirection): SortDirection => {
        if (current === 'DESC') return 'ASC';
        if (current === 'ASC') return '';
        return 'DESC';
    }, []);

    const handleSort = useCallback((direction: SortDirection) => {
        setBlocksSort(direction);
        onFilter(applyBlocksSort(data, direction));
    }, [data, chainInfo, onFilter, applyBlocksSort]);

    const resetSort = useCallback(() => {
        setBlocksSort('');
        onFilter(data || []);
    }, [data, onFilter]);

    return {
        blocksSort,
        setBlocksSort: handleSort,
        getNextSortState,
        resetSort,
        applyBlocksSort
    };
}