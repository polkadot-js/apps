// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Result } from '@polkadot/types';
import type { Event, EventRecord } from '@polkadot/types/interfaces';
import type { XcmV2TraitsOutcome } from '@polkadot/types/lookup';
import type { Codec } from '@polkadot/types/types';

type EventCheck = (event: Event) => boolean;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function acceptAll (_: Event): boolean {
  return true;
}

function dispatchResult ({ data: [result] }: Event): boolean {
  return !result || (result as Result<Codec, Codec>).isErr;
}

// [approving, timepoint, multisig, callHash, result]
function dispatchResultMulti ({ data: [,,,, result] }: Event): boolean {
  return !result || (result as Result<Codec, Codec>).isErr;
}

function xcmAttempted ({ data: [outcome] }: Event): boolean {
  return !outcome || (outcome as XcmV2TraitsOutcome).isIncomplete;
}

const xcmPallet: Record<string, EventCheck> = {
  Attempted: xcmAttempted
};

const CHECKS: Record<string, Record<string, EventCheck>> = {
  multisig: {
    MultisigExecuted: dispatchResultMulti
  },
  polkadotXcm: xcmPallet,
  proxy: {
    ProxyExecuted: dispatchResult
  },
  sudo: {
    Sudid: dispatchResult,
    SudoAsDone: dispatchResult
  },
  utility: {
    BatchInterrupted: acceptAll,
    DispatchedAs: dispatchResult
  },
  xcmPallet
};

export function isIncompleteEvent ({ event }: EventRecord): boolean {
  const { method, section } = event;

  return (
    !!CHECKS[section] &&
    !!CHECKS[section][method] &&
    CHECKS[section][method](event)
  );
}
