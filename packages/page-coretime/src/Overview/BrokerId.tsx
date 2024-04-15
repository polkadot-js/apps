// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { useApi } from '@polkadot/react-hooks';
import type { u32 } from '@polkadot/types';

import React from 'react';

interface Props {
    className?: string;
    children?: React.ReactNode;
}

function BrokerId({ children, className }: Props): React.ReactElement<Props> | null {
    const { api } = useApi();
    const id = api.consts.coretime?.brokerId as u32;
    return (
        <div className={className}>
            {id?.toString()}
            {children}
        </div>
    );
}

export default React.memo(BrokerId);
