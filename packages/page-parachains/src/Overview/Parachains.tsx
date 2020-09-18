// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveParachain } from '@polkadot/api-derive/types';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  parachains?: DeriveParachain[];
}

function Parachains ({ parachains }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('parachains'), 'start', 2],
    [t('heads'), 'start'],
    [t('swap to id')],
    [t('scheduling')],
    []
  ]);

  return (
    <Table
      empty={parachains && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {parachains?.map((parachain): React.ReactNode => (
        <Parachain
          key={parachain.id.toString()}
          parachain={parachain}
        />
      ))}
    </Table>
  );
}

export default React.memo(styled(Parachains)`
  tbody tr {
    cursor: pointer;
  }
`);
