// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ComponentProps as BaseComponentProps } from '@canvas-ui/apps/types';

export interface ComponentProps extends BaseComponentProps {
  accounts: string[];
  contracts: string[];
  hasContracts: boolean;
  isContract: (_: string) => boolean;
}
