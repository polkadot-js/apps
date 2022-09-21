// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaDeposit } from '@polkadot/types/lookup';
import type { Referendum, ReferendumProps as Props } from '../types';

import React, { useMemo } from 'react';

import Deposit from './Deposit';

interface Expanded {
  decision: Option<PalletReferendaDeposit> | null;
  submit: PalletReferendaDeposit | null;
  when: Date | null;
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
      when: new Date(data[0].toNumber())
    }
    : {
      decision: null,
      submit: null,
      when: null
    };
}

function Tuple ({ value: { info } }: Props): React.ReactElement<Props> {
  const { decision, submit, when } = useMemo(
    () => expandTuple(info),
    [info]
  );

  return (
    <>
      <td className='all' />
      <Deposit
        decision={decision}
        submit={submit}
      />
      <td
        className='number'
        colSpan={2}
      >
        {when && (
          when.toUTCString()
        )}
      </td>
      <td className='number'>
        {info.type}
      </td>
    </>
  );
}

export default React.memo(Tuple);
