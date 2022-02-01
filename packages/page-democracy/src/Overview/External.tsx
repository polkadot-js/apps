// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React from 'react';

import { AddressMini, Button } from '@polkadot/react-components';
import { useCollectiveMembers } from '@polkadot/react-hooks';
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

  return (
    <tr className={className}>
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
      <td className='button'>
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
        </Button.Group>
      </td>
    </tr>
  );
}

export default React.memo(External);
