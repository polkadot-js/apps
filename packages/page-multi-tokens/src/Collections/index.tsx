// Copyright 2017-2022 @polkadot/app-multi-tokens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Collection from './Collection';

import type { BN } from '@polkadot/util';

interface Props {
  className?: string;
  ids?: BN[];
}

function Collections({ className, ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([[t('collections'), 'start', 1], [t('owner'), 'address'], [t('tokens')], [t('attributes')], []]);

  return (
    <Table className={className} empty={ids && t<string>('No collections found')} header={headerRef.current}>
      {ids?.map((id) => (
        <Collection key={id.toString()} id={id} />
      ))}
    </Table>
  );
}

export default React.memo(Collections);
