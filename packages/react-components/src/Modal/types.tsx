// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

export interface ColumnsProps {
  children: React.ReactNode;
  className?: string;
  hint?: React.ReactNode;
}

export interface ModalProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  open?: boolean;
  [index: string]: any;
}

export interface ActionsProps {
  className?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  withOr?: boolean;
  onCancel: () => void;
}
