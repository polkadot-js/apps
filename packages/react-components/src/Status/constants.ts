// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueueTxStatus } from './types';

export const STATUS_COMPLETE: QueueTxStatus[] = [
  // status from subscription
  'finalitytimeout', 'finalized', 'inblock', 'usurped', 'dropped', 'invalid',
  // normal completion
  'cancelled', 'error', 'sent'
];
