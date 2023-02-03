// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props as ExpanderProps } from './Expander';

import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components';

import Expander from './Expander';
import Table from './Table';

interface Props extends ExpanderProps {
  empty?: string;
  renderChildren?: () => React.ReactNode[];
}

function mapRow (row: React.ReactNode, key: number): React.ReactNode {
  return (
    <tr key={key}>
      <td>{row}</td>
    </tr>
  );
}

function ExpanderScroll ({ children, className, empty, help, helpIcon, renderChildren, summary }: Props): React.ReactElement<Props> {
  const hasContent = useMemo(
    () => !!(renderChildren || children),
    [children, renderChildren]
  );

  const innerRender = useCallback(
    (): React.ReactNode => (renderChildren || children) && (
      <div className='tableContainer'>
        <Table
          empty={empty}
          isInline
        >
          {renderChildren
            ? renderChildren().map(mapRow)
            : Array.isArray(children)
              ? children.map(mapRow)
              : <tr><td>{children}</td></tr>
          }
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
      renderChildren={hasContent ? innerRender : undefined}
      summary={summary}
    />
  );
}

export default React.memo(styled(ExpanderScroll)`
  .tableContainer {
    overflow-y: auto;
    display: block;
    margin: 0 0 0 auto;
    max-height: 13.75rem;
    // max-width: 25rem;
    // overflow-x: auto;
  }
`);
