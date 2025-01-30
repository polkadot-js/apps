// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Button, Dropdown, Input, Tag } from '@polkadot/react-components';

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
    const [selectedCore, setSelectedCore] = useState<string>('');
    const coretimeTypes = Object.keys(CoreTimeTypes)
        .filter(key => isNaN(Number(key)));

    const onCoreChange = useCallback((v: string) => {
        setSelectedCore(v);
        if (v === 'All') {
            onFilter(data);
            return;
        }
        const filteredData = data.filter((paraId) => {
            const taskInfo = chainInfo[paraId]?.workTaskInfo;
            return taskInfo?.length > 0 && taskInfo[0]?.workload?.core?.toString() === v;
        });
        onFilter(filteredData);
    }, [chainInfo, data, onFilter]);

    const coreOptions = useMemo(() => {
        const cores = new Set<string>();

        // Collect all unique cores from workTaskInfo
        Object.values(chainInfo).forEach((info) => {
            console.log('info', info);
            if (info?.workTaskInfo?.length > 0 && info.workTaskInfo[0]?.workload?.core) {
                console.log('core: ', info.workTaskInfo[0].workload.core.toString());
                cores.add(info.workTaskInfo[0].workload.core.toString());
            }
        });
        return [
            {
                text: t('All cores'),
                value: 'All'
            },
            ...Array.from(cores).sort((a, b) => parseInt(a) - parseInt(b)).map((core) => ({
                text: t('Core {{core}}', { replace: { core } }),
                value: core
            }))
        ];
    }, [chainInfo, t]);

    const [blocksSort, setBlocksSort] = useState<'DESC' | 'ASC' | ''>('');

    const getNextSortState = useCallback((current: 'DESC' | 'ASC' | ''): 'DESC' | 'ASC' | '' => {
        if (current === 'DESC') return 'ASC';
        if (current === 'ASC') return '';
        return 'DESC';
    }, []);

    const typeOptions = useMemo(() => {
        return [
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


    useEffect(() => {
        if (!data || !chainInfo) {
            return;
        }
        if (blocksSort === '') {
            onFilter(data);
            return;
        }

        const sortedData = [...data].sort((a, b) => {
            const aInfo = chainInfo[a]?.workTaskInfo[0];
            const bInfo = chainInfo[b]?.workTaskInfo[0];

            if (!aInfo) return blocksSort === 'DESC' ? 1 : -1;
            if (!bInfo) return blocksSort === 'DESC' ? -1 : 1;

            return blocksSort === 'DESC'
                ? bInfo.lastBlock - aInfo.lastBlock
                : aInfo.lastBlock - bInfo.lastBlock;
        });

        if (blocksSort && JSON.stringify(sortedData) !== JSON.stringify(data)) {
            onFilter(sortedData);
        }
    }, [blocksSort, data, chainInfo]);


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
        if (v === 'All') {
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

    // const resetFilters = useCallback(() => {
    //     setSearchValue('');
    //     setSelectedType('');
    //     setSelectedCore('');
    //     setBlocksSort('');
    //     console.log('data', data);
    //     onFilter(data);
    // }, [data, onFilter]);

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
            <Dropdown
                className='isSmall'
                onChange={onCoreChange}
                options={coreOptions}
                placeholder={t('select core')}
                value={selectedCore}
            />
            <div
                style={{ height: '20px' }}>
                <Button
                    icon={blocksSort ? (blocksSort === 'DESC' ? 'arrow-down' : 'arrow-up') : 'sort'}
                    onClick={() => setBlocksSort(getNextSortState(blocksSort))}
                    label={t('blocks')}
                />
            </div>
            {/* {(searchValue || selectedType || selectedCore || blocksSort) && (
                <Button
                    className='isSmall'
                    icon='times'
                    onClick={resetFilters}
                    label={t('Reset filters')}
                />
            )} */}
        </div >);
}

export default Filters;
