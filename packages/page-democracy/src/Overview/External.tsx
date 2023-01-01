// Copyright 2017-2023 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React from 'react';

import { AddressMini, Button, Columar, ExpandButton, LinkExternal } from '@polkadot/react-components';
import { useCollectiveMembers, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import Fasttrack from './Fasttrack';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';

interface Props {
  className?: string;
  value: DeriveProposalExternal;
}

function External ({ className = '', value: { image, imageHash, threshold } }: Props): React.ReactElement<Props> | null {
  const { isMember, members } = useCollectiveMembers('technicalCommittee');
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  return (
    <>
      <tr className={`${className}${isExpanded ? ' noBorder' : ''}`}>
        <ProposalCell
          imageHash={imageHash}
          proposal={image?.proposal}
        />
        <td className='address'>
          {image && (
            <AddressMini value={image.proposer} />
          )}
        </td>
        <td className='number'>
          {image && <FormatBalance value={image.balance} />}
        </td>
        <td className='actions'>
          <Button.Group>
            {!image?.proposal && (
              <PreImageButton imageHash={imageHash} />
            )}
            {threshold && isMember && (
              <Fasttrack
                imageHash={imageHash}
                members={members}
                threshold={threshold}
              />
            )}
            <ExpandButton
              expanded={isExpanded}
              onClick={toggleIsExpanded}
            />
          </Button.Group>
        </td>
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded' : 'isCollapsed'}`}>
        <td
          className='columar'
          colSpan={100}
        >
          <Columar is100>
            <Columar.Column>
              <LinkExternal
                data={imageHash}
                type='external'
                withTitle
              />
            </Columar.Column>
          </Columar>
        </td>
      </tr>
    </>
  );
}

export default React.memo(External);
