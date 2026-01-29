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

  const apply = useCallback((data: number[], activeType: number[]): number[] => {
    return activeType.length > 0
      ? data.filter((id) => activeType.includes(id))
      : data;
  }, []);

  const reset = useCallback(() => {
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
      const taskInfo = chainInfo[paraId]?.workTaskInfo;

      return taskInfo?.length > 0 && taskInfo[0].type.toString() === v;
    });

    setActiveType(filteredData);
    onFilter(apply(data, filteredData));
  }, [chainInfo, data, onFilter, apply]);

  return {
    activeType,
    apply,
    onApply: onDropDownChange,
    reset,
    selectedType,
    typeOptions
  };
}
