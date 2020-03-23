// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useToggle } from '@polkadot/react-hooks';

import Icon from './Icon';

export interface Props extends BareProps {
  children?: React.ReactNode;
  isOpen?: boolean;
  summary: React.ReactNode;
  withHidden?: boolean;
}

function Expander ({ children, className, isOpen, summary, withHidden }: Props): React.ReactElement<Props> {
  const [isExpanded, toggleExpanded] = useToggle(isOpen);
  const hasContent = useMemo(
    (): boolean => !!children && (!Array.isArray(children) || children.length !== 0),
    [children]
  );

  return (
    <div
      className={`ui--Expander ${isExpanded && 'isExpanded'} ${className}`}
      onClick={toggleExpanded}
    >
      <div className='ui--Expander-summary'>
        {hasContent && (
          <Icon name={isExpanded ? 'angle double down' : 'angle double right'} />
        )}{summary}
      </div>
      {hasContent && (isExpanded || withHidden) && (
        <div className='ui--Expander-contents'>{children}</div>
      )}
    </div>
  );
}

export default React.memo(styled(Expander)`
  &:not(.isExpanded) .ui--Expander-contents {
    display: none;
  }

  .ui--Expander-summary {
    cursor: pointer;
    display: block;
    white-space: nowrap;

    i.icon {
      margin-right: 0.5rem;
    }
  }
`);
