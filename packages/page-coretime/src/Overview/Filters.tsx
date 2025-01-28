// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useCallback, useEffect, useState, useMemo } from 'react';

import { Input } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import { useRelayEndpoints } from '@polkadot/react-hooks/useParaEndpoints';

interface Props {
    data: number[];
    onFilter: (data: number[]) => void;
}

function Filters({ data, onFilter }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    const [searchValue, setSearchValue] = useState('');
    const endpoints = useRelayEndpoints();
    const [endPointsMap, setEndPointsMap] = useState<Record<string, number>>({});

    useEffect(() => {
        const endPointsMap = endpoints.reduce((acc: Record<string, number>, endpoint) => {
            if (endpoint?.text && endpoint.paraId) {
                acc[endpoint.text.toString()] = endpoint.paraId;
            }
            return acc;
        }, {});
        setEndPointsMap(endPointsMap);
    }, [endpoints]);

    const filteredData = useMemo(() => {
        if (!searchValue.trim()) {
            return data;
        }

        const searchLower = searchValue.toLowerCase();
        let results = data.filter((item) =>
            item.toString().toLowerCase().includes(searchLower)
        );

        if (!results.length) {
            Object.entries(endPointsMap).forEach(([key, value]) => {
                if (key.toLowerCase().includes(searchLower)) {
                    results.push(value);
                }
            });
        }

        return results;
    }, [data, searchValue, endPointsMap]);

    useEffect(() => {
        onFilter(filteredData);
    }, [filteredData, onFilter]);

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

    return (
        <div>
            <div style={{ maxWidth: '250px' }}>
                <Input
                    className='full isSmall'
                    label={t('Search by parachain id or name')}
                    onChange={onInputChange}
                    placeholder={t('parachain id or name')}
                    value={searchValue}
                    aria-label={t('Search by parachain id or name')}
                />
            </div>
        </div>);
}

export default Filters;
