// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Dropdown, Input, Tag } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { useRelayEndpoints } from '@polkadot/react-hooks/useParaEndpoints';
import { CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { coretimeTypeColours } from '../utils/index.js';
import { FlagColor } from '@polkadot/react-components/types';
import { ChainInformation } from '@polkadot/react-hooks/types';

interface Props {
    data: number[];
    chainInfo: Record<number, ChainInformation>;
    onFilter: (data: number[]) => void;
}

function Filters({ data, chainInfo, onFilter }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const endpoints = useRelayEndpoints();
    const [endPointsMap, setEndPointsMap] = useState<Record<string, number>>({});
    const [selectedType, setSelectedType] = useState<string>('');
    const coretimeTypes = Object.keys(CoreTimeTypes)
        .filter(key => isNaN(Number(key)));

    const typeOptions = useMemo(() => {
        return [
            {
                value: '',
                text: 'All'
            },
            ...coretimeTypes.map((type) => ({
                value: CoreTimeTypes[type].toString(),
                text: (
                    <Tag
                        color={coretimeTypeColours[CoreTimeTypes[type]] as FlagColor}
                        label={type}
                    />
                )
            }))
        ];
    }, [coretimeTypes]);

    useEffect(() => {
        const endPointsMap = endpoints.reduce((acc: Record<string, number>, endpoint) => {
            if (endpoint?.text && endpoint.paraId) {
                acc[endpoint.text.toString()] = endpoint.paraId;
            }
            return acc;
        }, {});
        setEndPointsMap(endPointsMap);
    }, [endpoints]);

    const onInputChange = useCallback((v: string) => {
        setSearchValue(v);

        if (!v.trim()) {
            onFilter(data);
            return;
        }

        const searchLower = v.toLowerCase();
        const filteredData = [...new Set([
            ...data.filter((item) => item.toString().toLowerCase().includes(searchLower)),
            ...Object.entries(endPointsMap)
                .filter(([key]) => key.toLowerCase().includes(searchLower))
                .map(([, value]) => value)
        ])];

        onFilter(filteredData);
    }, [data, endPointsMap, onFilter]);

    const onDropDownChange = useCallback((v: string) => {
        setSelectedType(v);
        if (v === 'all') {
            onFilter(data);
            return;
        }
        const filteredData = data
            .filter((paraId) => {
                const taskInfo = chainInfo[paraId].workTaskInfo;
                if (taskInfo.length > 0) {
                    return taskInfo[0].type.toString() === v
                }
                return false;
            })
        onFilter(filteredData);
    }, [chainInfo, data, onFilter]);

    return (
        <div style={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
            <div style={{ minWidth: '250px' }}>
                <Input
                    className='full isSmall'
                    label={t('Search')}
                    onChange={onInputChange}
                    placeholder={t('parachain id or name')}
                    value={searchValue}
                    aria-label={t('Search by parachain id or name')}
                />
            </div>
            <Dropdown
                className='isSmall'
                label={t('type')}
                onChange={onDropDownChange}
                options={typeOptions}
                placeholder='select type'
                value={selectedType}
            />

        </div>);
}

export default Filters;
