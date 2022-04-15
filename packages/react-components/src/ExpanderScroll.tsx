// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props as ExpanderProps } from './Expander';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Expander from './Expander';
import Table from './Table';

interface Props extends ExpanderProps {
  empty?: string;
}

// TODO Not 100% convinced we need a table here since we only have a single row,
// however at this point we convert as-is, but it should probably get a re-look
function ExpanderScroll ({ children, className, empty, help, helpIcon, renderChildren, summary }: Props): React.ReactElement<Props> {
  const innerRender = useCallback(
    (): React.ReactNode => (renderChildren || children) && (
      <div className='tableContainer'>
        <Table
          empty={empty}
          isInline
        >
          <tr className='expand'>
            <td>{renderChildren ? renderChildren() : children}</td>
          </tr>
        </Table>
      </div>
    ),
    [children, empty, renderChildren]
  );

  return (
    <Expander
      className={className}
      help={help}
      helpIcon={helpIcon}
      renderChildren={innerRender}
      summary={summary}
    />
  );
}

export default React.memo(styled(ExpanderScroll)`
  .tableContainer {
    overflow-y: scroll;
    display: block;
    min-height: 50px;
    max-height: 200px;
    overflow-x: hidden;
  }
`);
