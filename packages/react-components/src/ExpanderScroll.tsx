// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Props as ExpanderProps } from './Expander.js';

import React, { useCallback, useMemo } from 'react';

import Table from './Table/index.js';
import Expander from './Expander.js';
import { styled } from './styled.js';

interface Props extends ExpanderProps {
  empty?: string;
  renderChildren?: (() => React.ReactNode[] | undefined | null) | null;
}

function mapRow (row: React.ReactNode, key: number): React.ReactNode {
  return (
    <tr key={key}>
      <td>{row}</td>
    </tr>
  );
}

function ExpanderScroll ({ children, className, empty, renderChildren, summary }: Props): React.ReactElement<Props> {
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
            ? renderChildren()?.map(mapRow)
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
    <StyledExpander
      className={className}
      renderChildren={hasContent ? innerRender : undefined}
      summary={summary}
    />
  );
}

const StyledExpander = styled(Expander)`
  .tableContainer {
    overflow-y: scroll;
    display: block;
    margin: 0 0 0 auto;
    max-height: 13.75rem;
    max-width: 25rem;
    overflow-x: hidden;
  }
`;

export default React.memo(ExpanderScroll);
