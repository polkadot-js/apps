// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useRelayEndpoints } from '@polkadot/react-hooks/useParaEndpoints';
import React, { useState, useCallback, useMemo } from 'react';

interface UseSearchFilterProps {
    data: number[];
    onFilter: (data: number[]) => void;
}

export function useSearchFilter({ data, onFilter }: UseSearchFilterProps) {
    const [searchValue, setSearchValue] = useState('');
    const endpoints = useRelayEndpoints();
    const endPointsMap = useMemo(() => endpoints.reduce((acc: Record<string, number>, endpoint) => {
        if (endpoint?.text && endpoint.paraId) {
            acc[endpoint.text.toString()] = endpoint.paraId;
        }
        return acc;
    }, {}), [endpoints]);


    const resetSearch = useCallback(() => {
        setSearchValue('');
        onFilter(data);
    }, [data, onFilter]);

    const onInputChange = useCallback((v: string) => {
        setSearchValue(v);
        const trimmed = v.trim();
        const searchLower = trimmed.toLowerCase();

        const matchingIds = new Set<number>();

        if (searchLower) {
            data.forEach((item) => {
                if (item.toString().toLowerCase().includes(searchLower)) {
                    matchingIds.add(item);
                }
            });

            Object.entries(endPointsMap).forEach(([key, value]) => {
                if (key.toLowerCase().includes(searchLower) && data.includes(value)) {
                    matchingIds.add(value);
                }
            });

        } else {
            data.forEach((item) => {
                matchingIds.add(item);
            });
        }

        const filteredData = Array.from(matchingIds);

        onFilter(filteredData);
    }, [data, endPointsMap, onFilter]);

    return {
        searchValue,
        onInputChange,
        resetSearch
    };
}