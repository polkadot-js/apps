// Copyright 2017-2020 @canvas-ui/app-execute authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentProps as BaseComponentProps } from '@canvas-ui/apps/types';

export interface ComponentProps extends BaseComponentProps {
  accounts: string[];
  contracts: string[];
  hasContracts: boolean;
  isContract: (_: string) => boolean;
}
