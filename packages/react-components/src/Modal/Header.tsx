// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

function Header ({ className = '', header, onClose }: HeaderProps) {
  return (
    <div className={`${className} ui--Modal__Header`}>
      {header && (
        <h1>{header}</h1>
      )}
      <Button
        dataTestId='close-modal'
        icon='times'
        onClick={onClose}
      />
    </div>
  );
}

export default React.memo(styled(Header)`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0;
`);
