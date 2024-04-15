// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreDescription } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import CoreDescriptor from './CoreDescriptor.js';

interface Props {
    className?: string;
    coreInfos?: CoreDescription[] | CoreDescription;
}

function CoreDescriptors({ className, coreInfos }: Props): React.ReactElement<Props> {
    const { t } = useTranslation();
    let sanitized: CoreDescription[] = [];

    const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
        [t('core'), 'start', 1],
        [t('current work'), 'start media--1300'],
        [t('work queue'), 'start media--1600'],
    ]);

    if (Array.isArray(coreInfos)) {
        sanitized = coreInfos;
    } else if (coreInfos) {
        sanitized.push(coreInfos);
    }

    return (
        <Table
            className={className}
            empty={coreInfos && t('No core description found')}
            header={headerRef.current}
        >
            {sanitized?.map((v) => (
                <CoreDescriptor
                    key={v.core}
                    value={v}
                />
            ))}
        </Table>
    );
}

export default React.memo(CoreDescriptors);
