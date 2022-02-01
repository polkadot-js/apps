// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { Icon } from '@polkadot/react-components';

interface Props {
  onClick: () => void;
  expanded: boolean;
  className?: string;
}

function ExpandButton ({ className = '', expanded, onClick }: Props): React.ReactElement<Props> {
  return (
    <div
      className={`ui--ExpandButton ${className}`}
      data-testid='row-toggle'
      onClick={onClick}
    >
      <Icon icon={expanded ? 'caret-up' : 'caret-down'} />
    </div>
  );
}

export default React.memo(styled(ExpandButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  border: 1px solid var(--border-table);
  border-radius: 4px;
  cursor: pointer;
`);
