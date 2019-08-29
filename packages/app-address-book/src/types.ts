// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/react-components/types';
import { ActionStatus } from '@polkadot/react-components/Status/types';

export interface ComponentProps extends AppProps {
  location: any;
}

export interface ModalProps {
  onClose: () => void;
  onStatusChange: (status: ActionStatus) => void;
}
