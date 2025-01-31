// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FlagColor } from '@polkadot/react-components/types';
import type { ChainInfoFilterProps } from '../../types.js';

import React, { useCallback, useState } from 'react';

import { Tag } from '@polkadot/react-components';
import { CoreTimeTypes } from '@polkadot/react-hooks/constants';

import { coretimeTypeColours } from '../../utils/index.js';

const coretimeTypes = Object.keys(CoreTimeTypes).filter((key) => isNaN(Number(key)));

const typeOptions = [
  {
    text: 'All',
    value: 'All'
  },
  ...coretimeTypes.map((type) => ({
    text: (
      <Tag
        color={coretimeTypeColours[CoreTimeTypes[type as keyof typeof CoreTimeTypes]] as FlagColor}
        label={type}
      />
    ),
    value: CoreTimeTypes[type as keyof typeof CoreTimeTypes].toString()
  }))
];

export function useTypeFilter ({ chainInfo, data, onFilter }: ChainInfoFilterProps) {
  const [selectedType, setSelectedType] = useState<string>('');
  const [activeType, setActiveType] = useState<number[]>([]);

  const applyTypeFilter = useCallback((data: number[], activeType: number[]): number[] => {
    return activeType.length > 0
      ? data.filter((id) => activeType.includes(id))
      : data;
  }, []);

  const resetType = useCallback(() => {
    setSelectedType('');
    setActiveType([]);
    onFilter(data);
  }, [data, onFilter]);

  const onDropDownChange = useCallback((v: string) => {
    setSelectedType(v);

    if (!v || v === 'All') {
      setActiveType([]);
      onFilter(data);

      return;
    }

    const filteredData = data.filter((paraId) => {
      if (!chainInfo[paraId]) {
        return false;
      }

      const taskInfo = chainInfo[paraId].workTaskInfo;

      if (taskInfo.length > 0) {
        return taskInfo[0].type.toString() === v;
      }

      return false;
    });

    setActiveType(filteredData);
    onFilter(applyTypeFilter(data, filteredData));
  }, [chainInfo, data, onFilter, applyTypeFilter]);

  return {
    activeType,
    applyTypeFilter,
    onDropDownChange,
    resetType,
    selectedType,
    typeOptions
  };
}
