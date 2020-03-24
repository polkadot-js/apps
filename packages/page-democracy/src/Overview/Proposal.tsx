// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, AddressSmall, Button, Expander, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Seconding from './Seconding';

interface Props {
  className?: string;
  value: DeriveProposal;
}

function Proposal ({ className, value: { balance, hash, index, proposal, proposer, seconds } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const seconding = seconds.filter((_address, index): boolean => index !== 0);

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <td className='address'>
        <AddressSmall value={proposer} />
      </td>
      <td className='number together top'>
        <FormatBalance label={<label>{t('locked')}</label>} value={balance} />
      </td>
      <ProposalCell
        className='top'
        proposalHash={hash}
        proposal={proposal}
      />
      <td className='top padtop'>
        {seconding.length !== 0 && (
          <Expander summary={t('Seconds ({{count}})', { replace: { count: seconding.length } })}>
            {seconding.map((address, count): React.ReactNode => (
              <AddressMini
                className='identityIcon'
                key={`${count}:${address}`}
                value={address}
                withBalance={false}
                withShrink
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='together number top'>
        <Button.Group>
          <Seconding
            depositors={seconds || []}
            proposalId={index}
            proposal={proposal}
          />
          {!proposal && (
            <PreImageButton hash={hash} />
          )}
        </Button.Group>
        <LinkExternal
          data={index}
          type='proposal'
        />
      </td>
    </tr>
  );
}

export default React.memo(styled(Proposal)`
  .identityIcon {
    &:first-child {
      padding-top: 0;
    }

    &:last-child {
      margin-bottom: 4px;
    }
  }
`);
