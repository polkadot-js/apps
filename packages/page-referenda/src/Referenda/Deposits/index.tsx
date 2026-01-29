// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaDeposit, PalletReferendaTrackDetails } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';
import type { PalletReferenda } from '../../types.js';

import React from 'react';

import { AddressMini, styled } from '@polkadot/react-components';

import Place from './Place.js';
import Refund from './Refund.js';

interface Props {
  canDeposit?: boolean;
  canRefund?: boolean;
  className?: string;
  decision: PalletReferendaDeposit | null;
  id: BN;
  noMedia?: boolean;
  palletReferenda: PalletReferenda;
  submit: PalletReferendaDeposit | null;
  track?: PalletReferendaTrackDetails;
}

function Deposits ({ canDeposit, canRefund, className = '', decision, id, noMedia, palletReferenda, submit, track }: Props): React.ReactElement<Props> {
  return (
    <StyledTd className={`${className} address ${noMedia ? '' : 'media--1000-noPad'}`}>
      {submit && (
        <AddressMini
          balance={submit.amount}
          className={noMedia ? '' : 'media--1000'}
          value={submit.who}
          withBalance
        />
      )}
      {decision
        ? (
          <>
            <AddressMini
              balance={decision.amount}
              className={noMedia ? '' : 'media--1000'}
              value={decision.who}
              withBalance
            />
            {canRefund && (
              <div className={noMedia ? '' : 'media--1000'}>
                <Refund
                  id={id}
                  palletReferenda={palletReferenda}
                />
              </div>
            )}
          </>
        )
        : canDeposit && track && (
          <div className={noMedia ? '' : 'media--1000'}>
            <Place
              id={id}
              palletReferenda={palletReferenda}
              track={track}
            />
          </div>
        )
      }
    </StyledTd>
  );
}

const StyledTd = styled.td`
  .ui--AddressMini+.ui--Button {
    margin-top: 0.25rem;
  }
`;

export default React.memo(Deposits);
