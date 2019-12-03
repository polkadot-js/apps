// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Hash } from '@polkadot/types/interfaces';

export interface ComponentProps extends I18nProps {
  className?: string;
  proposals?: Hash[];
  members?: AccountId[];
}
