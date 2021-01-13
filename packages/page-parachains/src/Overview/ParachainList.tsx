// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  ids?: ParaId[];
}

function ParachainList ({ ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumberFinalized = useCall<BN>(api.derive.chain.bestNumberFinalized);

  const headerRef = useRef([
    [t('parachains'), 'start', 2],
    [t('heads'), 'start'],
    [t('watermark'), 'undefined', 2],
    [t('chain best')]
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Parachain
          bestNumberFinalized={bestNumberFinalized}
          id={id}
          key={id.toString()}
        />
      ))}
    </Table>
  );
}

export default React.memo(ParachainList);
