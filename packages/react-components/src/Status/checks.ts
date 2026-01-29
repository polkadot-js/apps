// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

// we use augmented types in this tsconfig
import '@polkadot/api-augment/substrate';

import type { DispatchError, DispatchResult, Event, EventRecord } from '@polkadot/types/interfaces';
import type { StagingXcmV5TraitsOutcome } from '@polkadot/types/lookup';

type EventCheck = (event: Event) => string | null;

const INCOMPLETE = 'incomplete execution';

function extractError (result: DispatchResult): string | null {
  if (!result) {
    return INCOMPLETE;
  } else if (result.isErr) {
    return `error: ${getDispatchError(result.asErr)}`;
  }

  return null;
}

function batchInterrupted ({ data: [index, error] }: Event): string | null {
  return `error: ${index.toString()}: ${getDispatchError(error as DispatchError)}`;
}

function dispatchResult ({ data: [result] }: Event): string | null {
  return extractError(result as DispatchResult);
}

function dispatchResultCouncil ({ data: [, result] }: Event): string | null {
  return extractError(result as DispatchResult);
}

// [approving, timepoint, multisig, callHash, result]
function dispatchResultMulti ({ data: [,,,, result] }: Event): string | null {
  return extractError(result as DispatchResult);
}

function xcmAttempted ({ data: [outcome] }: Event): string | null {
  if (!outcome) {
    return INCOMPLETE;
  } else if ((outcome as StagingXcmV5TraitsOutcome).isIncomplete) {
    const error = (outcome as StagingXcmV5TraitsOutcome).asIncomplete.error;

    return `error: ${error.error.type}`;
  }

  return null;
}

const collective: Record<string, EventCheck> = {
  Executed: dispatchResultCouncil
};

const xcmPallet: Record<string, EventCheck> = {
  Attempted: xcmAttempted
};

const CHECKS: Record<string, Record<string, EventCheck>> = {
  allianceMotion: collective,
  council: collective,
  membership: collective,
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
  technicalCommittee: collective,
  utility: {
    BatchInterrupted: batchInterrupted,
    DispatchedAs: dispatchResult
  },
  xcmPallet
};

export function getDispatchError (dispatchError: DispatchError): string {
  let message: string = dispatchError.type;

  if (dispatchError.isModule) {
    try {
      const mod = dispatchError.asModule;
      const error = dispatchError.registry.findMetaError(mod);

      message = `${error.section}.${error.name}`;
    } catch {
      // swallow
    }
  } else if (dispatchError.isToken) {
    message = `${dispatchError.type}.${dispatchError.asToken.type}`;
  }

  return message;
}

export function getIncompleteMessage ({ event }: EventRecord): string | null {
  const { method, section } = event;

  return (
    !!CHECKS[section] &&
    !!CHECKS[section][method] &&
    CHECKS[section][method](event)
  );
}
