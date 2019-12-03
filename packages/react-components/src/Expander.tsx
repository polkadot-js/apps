// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { useState } from 'react';

export interface Props extends BareProps {
  children: React.ReactNode;
  summary: React.ReactNode;
}

export default function Expanded ({ children, className, summary }: Props): React.ReactElement<Props> {
  const [isExpanded, setIsExpanded] = useState(false);

  const _toggle = (event: React.SyntheticEvent): void => {
    event.preventDefault();
    event.stopPropagation();

    setIsExpanded(!isExpanded);
  };

  return (
    <details
      className={`ui--Expander ${className}`}
      open={isExpanded}
    >
      <summary onClick={_toggle}>{summary}</summary>
      {isExpanded && children}
    </details>
  );
}
