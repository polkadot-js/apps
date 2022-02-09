// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec } from '@polkadot/types/types';

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';

import Description from './Description';
import { useTranslation } from './translate';

interface Props {
  curator: Codec;
  isFromProposal: boolean;
}

function Curator ({ curator, isFromProposal }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  return (
    <div>
      <AddressSmall value={curator.toString()} />
      {isFromProposal && <Description description={t<string>('Proposed Curator')} />}
    </div>
  );
}

export default React.memo(Curator);
