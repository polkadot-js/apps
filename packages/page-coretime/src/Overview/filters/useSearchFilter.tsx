// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useMemo, useState } from 'react';

import { useRelayEndpoints } from '@polkadot/react-hooks/useParaEndpoints';

interface UseSearchFilterProps {
  data: number[];
  onFilter: (data: number[]) => void;
}

export function useSearchFilter ({ data, onFilter }: UseSearchFilterProps) {
  const [searchValue, setSearchValue] = useState('');
  const [activeSearch, setActiveSearch] = useState<number[]>([]);
  const endpoints = useRelayEndpoints();
  const endPointsMap = useMemo(() => endpoints.reduce((acc: Record<string, number>, endpoint) => {
    if (endpoint?.text && endpoint.paraId) {
      const textValue = React.isValidElement(endpoint.text)
        ? ''
        : String(endpoint.text);

      acc[textValue] = endpoint.paraId;
    }

    return acc;
  }, {}), [endpoints]);

  const applySearchFilter = useCallback((data: number[], activeSearch: number[]): number[] => {
    return activeSearch.length > 0
      ? data.filter((id) => activeSearch.includes(id))
      : data;
  }, []);

  const resetSearch = useCallback(() => {
    setSearchValue('');
    setActiveSearch([]);
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

    setActiveSearch(filteredData);
    onFilter(applySearchFilter(data, filteredData));
  }, [data, endPointsMap, onFilter, applySearchFilter]);

  return {
    activeSearch,
    applySearchFilter,
    onInputChange,
    resetSearch,
    searchValue
  };
}
