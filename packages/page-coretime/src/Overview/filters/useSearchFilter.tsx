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
  const endpoints = useRelayEndpoints();
  const endPointsMap = useMemo(() =>
    Object.fromEntries(
      endpoints
        .filter((e) => e?.text && e.paraId)
        .map((e) => [
          React.isValidElement(e.text) ? '' : String(e.text),
          e.paraId
        ])
    ),
  [endpoints]
  );

  const apply = useCallback((data: number[], activeSearch: number[]): number[] => {
    return activeSearch.length > 0
      ? data.filter((id) => activeSearch.includes(id))
      : data;
  }, []);

  const reset = useCallback(() => {
    setSearchValue('');
    onFilter(data);
  }, [data, onFilter]);

  const onInputChange = useCallback((v: string) => {
    setSearchValue(v);
    const searchLower = v.trim().toLowerCase();

    if (!searchLower) {
      onFilter(data);

      return;
    }

    const matchingIds = new Set<number>();

    for (const item of data) {
      const itemStr = item.toString().toLowerCase();

      if (itemStr.includes(searchLower)) {
        matchingIds.add(item);
        continue;
      }

      for (const [key, value] of Object.entries(endPointsMap)) {
        if (key.toLowerCase().includes(searchLower) && value === item) {
          matchingIds.add(item);
          break;
        }
      }
    }

    const filteredData = Array.from(matchingIds);

    onFilter(apply(data, filteredData));
  }, [data, endPointsMap, onFilter, apply]);

  return {
    apply,
    onApply: onInputChange,
    reset,
    searchValue
  };
}
