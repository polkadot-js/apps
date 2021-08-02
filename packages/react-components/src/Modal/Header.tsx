// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Button from '@polkadot/react-components/Button';

import { HeaderProps } from './types';

export const Header: React.FC<HeaderProps> = ({ header, onClose }) => (
  <ModalHeader className='header'>
    {header && (
      <h1>{header}</h1>
    )}
    <Button
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
