// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ProposalExt } from './types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Badge } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { sliceHex } from './util';

interface Props {
  proposal: ProposalExt;
}

function Proposal ({ proposal: { id, isApproved, proposal: { balance, genesisHead, name, proposer, validationCode, validators } } }: Props): React.ReactElement<Props> {
  const initialHex = useMemo(
    () => sliceHex(genesisHead, 8),
    [genesisHead]
  );

  const validationHex = useMemo(
    () => sliceHex(validationCode, 8),
    [validationCode]
  );

  return (
    <tr>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge'>
        {isApproved && (
          <Badge
            color='green'
            icon='check'
          />
        )}
      </td>
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
