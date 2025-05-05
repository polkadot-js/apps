// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainInformation } from '@polkadot/react-hooks/types';
import type { ChainInfoFilterProps, SortDirection } from '../../types.js';

import { useCallback, useState } from 'react';

export function sortByBlocks (data: number[], chainInfo: Record<number, ChainInformation>, direction: SortDirection): number[] {
  if (!data || !chainInfo || !direction) {
    return data || [];
  }

  const filteredData = data.filter((block) => !!chainInfo[block]?.workTaskInfo[0]);

  return [...filteredData].sort((a, b) => {
    const aInfo = chainInfo[a]?.workTaskInfo[0];
    const bInfo = chainInfo[b]?.workTaskInfo[0];

    return direction === 'DESC'
      ? bInfo.lastBlock - aInfo.lastBlock
      : aInfo.lastBlock - bInfo.lastBlock;
  });
}

const getNextSortState = (current: SortDirection): SortDirection =>
  ({ '': 'DESC', ASC: '', DESC: 'ASC' } as const)[current];

export function useBlocksSort ({ chainInfo, data, onFilter }: ChainInfoFilterProps) {
  const [direction, setDirection] = useState<SortDirection>('');

  const apply = useCallback((data: number[], sort: SortDirection): number[] => {
    return sort
      ? sortByBlocks(data, chainInfo, sort)
      : data;
  }, [chainInfo]);

  const onApply = useCallback(() => {
    const nextDirection = getNextSortState(direction);

    setDirection(nextDirection);
    onFilter(nextDirection ? sortByBlocks(data, chainInfo, nextDirection) : data);
  }, [data, chainInfo, onFilter, direction]);

  const reset = useCallback(() => {
    setDirection('');
    onFilter(data || []);
  }, [data, onFilter]);

  return {
    apply,
    direction,
    onApply,
    reset
  };
}
