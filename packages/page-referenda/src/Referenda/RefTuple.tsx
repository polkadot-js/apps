// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaDeposit } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Referendum, ReferendumProps as Props } from '../types.js';

import React, { useMemo } from 'react';

import Deposits from './Deposits/index.js';
import RefEnd from './RefEnd.js';
import { unwrapDeposit } from './util.js';

interface Expanded {
  decision: PalletReferendaDeposit | null;
  submit: PalletReferendaDeposit | null;
  when: BN | null;
}

function expandTuple (info: Referendum['info']): Expanded {
  const data = info.isApproved
    ? info.asApproved
    : info.isRejected
      ? info.asRejected
      : info.isCancelled
        ? info.asCancelled
        : info.isTimedOut
          ? info.asTimedOut
          : null;

  return data
    ? {
      decision: unwrapDeposit(data[2]),
      submit: unwrapDeposit(data[1]),
      when: data[0]
    }
    : {
      decision: null,
      submit: null,
      when: null
    };
}

function Tuple ({ palletReferenda, value: { id, info, track } }: Props): React.ReactElement<Props> {
  const { decision, submit, when } = useMemo(
    () => expandTuple(info),
    [info]
  );

  return (
    <>
      <td
        className='no-pad'
        colSpan={4}
      />
      <Deposits
        canRefund
        className='all'
        decision={decision}
        id={id}
        noMedia
        palletReferenda={palletReferenda}
        submit={submit}
        track={track}
      />
      <RefEnd
        label={info.type}
        when={when}
      />
    </>
  );
}

export default React.memo(Tuple);
