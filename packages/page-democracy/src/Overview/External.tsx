// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveProposalExternal } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressSmall, Button } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';

import { useTranslation } from '../translate';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Fasttrack from './Fasttrack';

interface Props {
  className?: string;
  value: DeriveProposalExternal;
}

function External ({ className, value: { image, imageHash, threshold } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='top'>
        {image && <AddressSmall value={image.proposer} />}
      </td>
      <td className='number together top'>
        {image && <FormatBalance label={<label>{t('locked')}</label>} value={image.balance} />}
      </td>
      <ProposalCell
        className='top'
        imageHash={imageHash}
        proposal={image?.proposal}
      />
      <td className='together number top'>
        <Button.Group>
          {!image?.proposal && (
            <PreImageButton
              imageHash={imageHash}
              withoutOr
            />
          )}
          {threshold && (
            <>
              {!image?.proposal && (
                <Button.Or />
              )}
              <Fasttrack
                imageHash={imageHash}
                threshold={threshold}
              />
            </>
          )}
        </Button.Group>
      </td>
    </tr>
  );
}

export default React.memo(External);
