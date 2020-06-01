// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressMini, Button } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Fasttrack from './Fasttrack';

interface Props {
  className?: string;
  value: DeriveProposalExternal;
}

function External ({ className = '', value: { image, imageHash, threshold } }: Props): React.ReactElement<Props> | null {
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
          {threshold && (
            <Fasttrack
              imageHash={imageHash}
              threshold={threshold}
            />
          )}
        </Button.Group>
      </td>
    </tr>
  );
}

export default React.memo(External);
