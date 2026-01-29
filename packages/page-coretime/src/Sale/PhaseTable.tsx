// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PhaseConfig } from '../types.js';

import React, { useRef } from 'react';

import { styled, Table } from '@polkadot/react-components';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate.js';

interface Props {
  phaseInfo: PhaseConfig['config'][keyof PhaseConfig['config']]
}

const StyledTable = styled(Table)`
  border-collapse: collapse;

  tr:last-child {
    border-bottom: 1px solid #e6e6e6;
  }
`;

function SaleTable ({ phaseInfo }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [],
    [t('Dates'), 'start media--800'],
    [t('Blocks (relay)'), 'start'],
    [t('Timeslices'), 'start']
  ]);

  return (
    <div style={{ maxWidth: '500px' }}>
      <StyledTable
        emptySpinner={false}
        header={headerRef.current}
        isSplit={false}
      >
        <tr>
          <td style={{ width: '100px' }}>Start</td>
          <td>{phaseInfo.start.date}</td>
          <td>{formatNumber(phaseInfo.start.blocks.relay)}</td>
          <td>{formatNumber(phaseInfo.start.ts)}</td>
        </tr>
        <tr>
          <td style={{ width: '100px' }}>End</td>
          <td>{phaseInfo.end.date}</td>
          <td>{formatNumber(phaseInfo.end.blocks.relay)}</td>
          <td>{formatNumber(phaseInfo.end.ts)}</td>
        </tr>

      </StyledTable>
    </div>
  );
}

export default React.memo(SaleTable);
