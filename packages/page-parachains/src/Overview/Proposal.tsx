// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ProposalExt } from './types';

import React, { useMemo } from 'react';
import { AddressSmall, AddressMini } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

interface Props {
  proposal: ProposalExt;
}

function Proposal ({ proposal: { id, proposal: { balance, initialHeadState, name, proposer, validationFunction, validators } } }: Props): React.ReactElement<Props> {
  const initialHex = useMemo(
    (): string => {
      const hex = initialHeadState.toHex();

      return `${hex.slice(0, 10)}…${hex.slice(-8)}`;
    },
    [initialHeadState]
  );

  const validationHex = useMemo(
    (): string => {
      const hex = validationFunction.toHex();

      return `${hex.slice(0, 10)}…${hex.slice(-8)}`;
    },
    [validationFunction]
  );

  return (
    <tr>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='start together'>{name.toUtf8()}</td>
      <td className='address'><AddressSmall value={proposer} /></td>
      <td className='balance'><FormatBalance value={balance} /></td>
      <td className='start hash together'>{initialHex}</td>
      <td className='start hash together'>{validationHex}</td>
      <td className='address all'>{validators.map((validatorId) => (
        <AddressMini
          key={validatorId.toString()}
          value={validatorId}
        />
      ))}</td>
    </tr>
  );
}

export default React.memo(Proposal);
