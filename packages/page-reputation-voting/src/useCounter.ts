// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { createNamedHook } from '@polkadot/react-hooks';

import useReferendaIds from './useReferendaIds.js';

function useCounterImpl (): number {
  // Use lightweight ID query instead of fetching full referendum data.
  // useReferendaIds already tracks ongoing referenda by subscribing to
  // Submitted/Approved/Rejected/Cancelled/TimedOut/Killed events,
  // so the count represents active referenda.
  const ids = useReferendaIds();

  return ids?.length || 0;
}

export default createNamedHook('useCounter', useCounterImpl);
