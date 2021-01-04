// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';

import React, { useRef } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Parachain from './Parachain';

interface Props {
  canRegister?: boolean;
  ids?: ParaId[];
}

function Parachains ({ ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('parachains'), 'start', 2],
    [t('heads'), 'start'],
    [t('watermark')]
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no registered parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Parachain
          id={id}
          key={id.toString()}
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
