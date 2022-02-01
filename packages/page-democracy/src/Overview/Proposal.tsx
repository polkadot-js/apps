// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposal } from '@polkadot/api-derive/types';

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
  const seconding = seconds.filter((_address, index) => index !== 0);

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
      <td className='number together media--1200'>
        <FormatBalance value={balance} />
      </td>
      <td className='expand'>
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
          {!image?.proposal && (
            <PreImageButton imageHash={imageHash} />
          )}
          <Seconding
            deposit={balance}
            depositors={seconds || []}
            image={image}
            proposalId={index}
          />
        </Button.Group>
      </td>
      <td className='links media--1000'>
        <LinkExternal
          data={index}
          isLogo
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
