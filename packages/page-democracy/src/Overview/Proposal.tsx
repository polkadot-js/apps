// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';
import { AddressMini, Button, Expander, LinkExternal } from '@polkadot/react-components';
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

function Proposal ({ className = '', value: { balance, image, imageHash, index, proposer, seconds } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const seconding = seconds.filter((_address, index): boolean => index !== 0);

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='address'>
        <AddressMini value={proposer} />
      </td>
      <td className='number together ui--media-1200'>
        <FormatBalance value={balance} />
      </td>
      <td>
        {seconding.length !== 0 && (
          <Expander summary={t<string>('Seconds ({{count}})', { replace: { count: seconding.length } })}>
            {seconding.map((address, count): React.ReactNode => (
              <AddressMini
                className='identityIcon'
                key={`${count}:${address.toHex()}`}
                value={address}
                withBalance={false}
                withShrink
              />
            ))}
          </Expander>
        )}
      </td>
      <td className='button'>
        <Button.Group>
          <Seconding
            depositors={seconds || []}
            image={image}
            proposalId={index}
          />
          {!image?.proposal && (
            <PreImageButton imageHash={imageHash} />
          )}
        </Button.Group>
      </td>
      <td className='mini ui--media-1000'>
        <LinkExternal
          data={index}
          type='proposal'
          withShort
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
