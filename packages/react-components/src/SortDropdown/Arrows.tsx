// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

interface Props {
  active: boolean
}

export function ArrowUp ({ active }: Props): React.ReactElement<Props> {
  return (
    <SvgContainer active={active}>
      <path
        d='M0 6L4.03 -3.47068e-07L8 6L0 6Z'
        fill='#8B8B8B'
      />
    </SvgContainer>
  );
}

export function ArrowDown ({ active }: Props): React.ReactElement<Props> {
  return (
    <SvgContainer active={active}>
      <path
        d='M8 0L3.97 6L0 0H8Z'
        fill='#8B8B8B'
      />
    </SvgContainer>
  );
}

function SvgContainer ({ active, children }: { active: boolean, children?: React.ReactNode; }): React.ReactElement {
  return (
    <svg
      className={`svg--arrow${active ? ' active' : ''}`}
      fill='none'
      height='6'
      viewBox='0 0 8 6'
      width='8'
      xmlns='http://www.w3.org/2000/svg'
    >
      {children}
    </svg>
  );
}
