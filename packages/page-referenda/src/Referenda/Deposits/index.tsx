// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { PalletReferendaDeposit, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../../types';

import React, { useMemo } from 'react';

import { AddressMini } from '@polkadot/react-components';

import Place from './Place';
import Refund from './Refund';

interface Props {
  canDeposit?: boolean;
  canRefund?: boolean;
  decision: Option<PalletReferendaDeposit> | null;
  id: BN;
  palletReferenda: PalletReferenda;
  submit: PalletReferendaDeposit | null;
  track?: PalletReferendaTrackInfo;
}

function Deposits ({ canDeposit, canRefund, decision, id, palletReferenda, submit, track }: Props): React.ReactElement<Props> {
  const [valSubmit, valDeposit] = useMemo(
    () => [submit, decision && decision.unwrapOr(null)],
    [decision, submit]
  );

  return (
    <td className='address'>
      {valSubmit && (
        <AddressMini
          balance={valSubmit.amount}
          value={valSubmit.who}
          withBalance
        />
      )}
      {valDeposit
        ? (
          <AddressMini
            balance={valDeposit.amount}
            value={valDeposit.who}
            withBalance
          />
        )
        : canDeposit
          ? track && (
            <Place
              id={id}
              palletReferenda={palletReferenda}
              track={track}
            />
          )
          : canRefund && (
            <Refund
              id={id}
              palletReferenda={palletReferenda}
            />
          )
      }
    </td>
  );
}

export default React.memo(Deposits);
