// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaDeposit } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { Referendum, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import Deposits from './Deposits';
import RefEnd from './RefEnd';

interface Expanded {
  decision: Option<PalletReferendaDeposit> | null;
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
      decision: data[2],
      submit: data[1],
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
      <RefEnd
        label={info.type}
        when={when}
      />
      <td className='all' />
      <Deposits
        canRefund
        decision={decision}
        id={id}
        palletReferenda={palletReferenda}
        submit={submit}
        track={track}
      />
      <td
        className='number'
        colSpan={3}
      />
      <td className='number'>

      </td>
    </>
  );
}

export default React.memo(Tuple);
