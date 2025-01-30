// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useState, useCallback } from 'react';
import { Tag } from '@polkadot/react-components';
import { CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { ChainInfoFilterProps } from '../../types.js';
import { coretimeTypeColours } from '../../utils/index.js';
import { FlagColor } from '@polkadot/react-components/types';

const coretimeTypes = Object.keys(CoreTimeTypes).filter(key => isNaN(Number(key)));

const typeOptions = [
    {
        value: 'All',
        text: 'All'
    },
    ...coretimeTypes.map((type) => ({
        value: CoreTimeTypes[type as keyof typeof CoreTimeTypes].toString(),
        text: (
            <Tag
                color={coretimeTypeColours[CoreTimeTypes[type as keyof typeof CoreTimeTypes]] as FlagColor}
                label={type}
            />
        )
    }))
];

export function useTypeFilter({ data, chainInfo, onFilter }: ChainInfoFilterProps) {
    const [selectedType, setSelectedType] = useState<string>('');

    const resetType = useCallback(() => {
        setSelectedType('');
    }, []);

    const onDropDownChange = useCallback((v: string) => {
        setSelectedType(v);
        if (!v || v === 'All') {
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
        onFilter(filteredData);
    }, [chainInfo, data, onFilter]);

    return {
        selectedType,
        onDropDownChange,
        typeOptions,
        resetType
    };
}