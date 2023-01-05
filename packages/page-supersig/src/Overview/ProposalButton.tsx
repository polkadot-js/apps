// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

import React from 'react';

import { Button } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Proposal from './ProposalModal';

interface Props {
  imageHash: Hash;
  isImminent?: boolean;
}

function ProposalButton ({ imageHash, isImminent }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isProposalOpen, toggleProposal] = useToggle();

  return (
    <>
      <Button
        icon='plus'
        label={t<string>('Proposal')}
        onClick={toggleProposal}
      />
      {isProposalOpen && (
        <Proposal
          imageHash={imageHash}
          isImminent={isImminent}
          onClose={toggleProposal}
        />
      )}
    </>
  );
}

export default React.memo(ProposalButton);
