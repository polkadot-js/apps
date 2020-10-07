// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '../types';

import React from 'react';

export interface ColumnProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps extends BareProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  isOpen?: boolean;
  [index: string]: any;
}

export interface ActionsProps extends BareProps {
  cancelLabel?: string;
  children: React.ReactNode;
  withOr?: boolean;
  onCancel: () => void;
}
