// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import Button from './Button';

interface Props {
  children: React.ReactNode;
  className?: string;
  offset?: number;
  onClose: () => void;
  position: 'left' | 'right';
}

function Sidebar ({ children, className = '', onClose }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Sidebar ${className}`}>
      <Button
        className='ui--Sidebar-close'
        icon='times'
        isBasic
        isCircular
        onClick={onClose}
      />
      {children}
    </div>
  );
}

export default React.memo(styled(Sidebar)(({ offset = 0, position }: Props) => `
  background: #f5f4f3;
  bottom: 0;
  box-shadow: ${position === 'right' ? '-6px' : '6px'} 0px 20px 0px rgba(0, 0, 0, 0.3);
  max-width: 24rem;
  position: fixed;
  padding: 1rem;
  top: 0;
  z-index: 999;
  ${position}: ${offset};

  .ui--Sidebar-close {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
  }
`));
