// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

import Description from './Description';
import { useTranslation } from './translate';

interface Props {
  className?: string;
  curator: Codec;
  isProposal: boolean;
}

function Curator ({ className, curator, isProposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div>
      <AddressSmall value={curator.toString()} />
      {isProposal && (
        <Description
          className={className}
          dataTestId='extendedCuratorStatus'
          description={t<string>('Proposed Curator')}
        />
      )}
    </div>
  );
}

export default React.memo(Curator);
