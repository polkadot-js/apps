// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';

export type ComponentProps = AppProps;

export type ModalProps = {
  onClose: () => void,
  onStatusChange: (status: ActionStatus) => void
};
