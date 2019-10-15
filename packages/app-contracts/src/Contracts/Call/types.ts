// Copyright 2017-2019 @polkadot/app-contracts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';

import { RouteComponentProps } from 'react-router';

export interface CallProps extends BareProps, I18nProps, ApiProps, RouteComponentProps<{}> {
  contractAddress: string | null;
  contractMethod: string | null;
  isOpen: boolean;
  onClose: () => void;
}
