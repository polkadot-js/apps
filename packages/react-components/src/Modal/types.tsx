// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

export interface ColumnProps {
  children: React.ReactNode;
  className?: string;
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
