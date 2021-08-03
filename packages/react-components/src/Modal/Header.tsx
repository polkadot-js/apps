// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { HeaderProps } from './types';

import React from 'react';
import styled from 'styled-components';

import Button from '../Button';

export const Header: React.FC<HeaderProps> = ({ header, onClose }) => (
  <ModalHeader className='header'>
    {header && (
      <h1>{header}</h1>
    )}
    <Button
      dataTestId='close-modal'
      icon='times'
      onClick={onClose}
    />
  </ModalHeader>
);

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.5rem 0px;
`;
