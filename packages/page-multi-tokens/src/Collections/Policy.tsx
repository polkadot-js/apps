// Copyright 2017-2022 @polkadot/app-multi-tokens authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';
import type { BN } from '@polkadot/util';

export type Constraints = { [key: string]: string | number | boolean | BN | null | undefined };

interface Props {
  policy: string;
  constraints?: Constraints;
  borders: ('top' | 'bottom' | 'left' | 'right')[];
}

const Policy = ({ policy, constraints, borders }: Props) => (
  <Container borderTop={borders.includes('top')} borderBottom={borders.includes('bottom')} borderLeft={borders.includes('left')} borderRight={borders.includes('right')}>
    <div className='policy-name'>{policy}</div>
    <ul>
      {constraints &&
        Object.keys(constraints).map((constraintKey) => (
          <li key={constraintKey}>
            {constraintKey}: <b>{constraints[constraintKey]?.toString()}</b>
          </li>
        ))}
    </ul>
  </Container>
);

const Container = styled.div<{
  borderTop?: boolean;
  borderBottom?: boolean;
  borderLeft?: boolean;
  borderRight?: boolean;
}>`
  width: 100%;
  height: 100%;
  padding: 5px;

  ul {
    margin: 0;
    padding-left: 20px;
  }

  ${({ borderTop }) => borderTop && `border-top: 1px solid var(--bg-page);`}
  ${({ borderBottom }) => borderBottom && `border-bottom: 1px solid var(--bg-page);`}
  ${({ borderLeft }) => borderLeft && `border-left: 1px solid var(--bg-page);`}
  ${({ borderRight }) => borderRight && `border-right: 1px solid var(--bg-page);`}
`;

export default React.memo(styled(Policy)`
  .policy-name {
    padding: 5px 0;
  }
`);
