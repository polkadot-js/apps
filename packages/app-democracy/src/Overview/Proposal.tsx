// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';
import ProposalCell from './ProposalCell';
import Seconding from './Seconding';

interface Props extends I18nProps {
  value: DeriveProposal;
}

function Proposal ({ className, t, value: { balance, hash, index, proposal, proposer, seconds } }: Props): React.ReactElement<Props> {
  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <td className='top'>
        <AddressSmall value={proposer} />
      </td>
      <td className='number together top'>
        <FormatBalance label={<label>{t('locked')}</label>} value={balance} />
      </td>
      <ProposalCell className='top' proposalHash={hash} proposal={proposal} />
      <td className='top'>
        {seconds
          .filter((_address, index): boolean => index !== 0)
          .map((address, count): React.ReactNode => (
            <AddressMini
              className='identityIcon'
              key={`${count}:${address}`}
              label={count ? undefined : t('seconds')}
              value={address}
              withBalance={false}
              withShrink
            />
          ))}
      </td>
      <td className='together number top'>
        <Seconding
          depositors={seconds || []}
          proposalId={index}
        />
      </td>
    </tr>
  );
}

export default translate(
  styled(Proposal)`
    .identityIcon {
      &:first-child {
        padding-top: 0;
      }

      &:last-child {
        margin-bottom: 4px;
      }
    }
  `
);
