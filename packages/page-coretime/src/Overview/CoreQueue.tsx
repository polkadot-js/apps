// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor } from '@polkadot/types/lookup';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

interface Props {
  value?: PolkadotRuntimeParachainsAssignerCoretimeQueueDescriptor;
}

function CoreQueue ({ value }: Props): React.ReactElement<Props> {
  const headerRef = useRef<([React.ReactNode?, string?] | false)[]>([
    ['work queue']
  ]);

  return (
    <Table header={headerRef.current}>
      {value
        ? <tr>
          <td>
            <h5>{'first'}</h5>
            {value?.first.toString()}
          </td>
          <td>
            <h5>{'last'}</h5>
            {value?.last.toString()}
          </td>
        </tr>
        : <tr>
          <td>
            {'No work queue found'}
          </td>
        </tr>}
    </Table>
  );
}

export default React.memo(CoreQueue);
