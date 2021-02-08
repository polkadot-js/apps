// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import React from 'react';

import { BN_ZERO } from '@polkadot/util';

import Description from '../Description';
import { useTranslation } from '../translate';

interface Props {
  blocksUntilPayout?: BN ;
  className?: string;
}

function ExtendedStatus ({ blocksUntilPayout, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <>
      {blocksUntilPayout?.lt(BN_ZERO) &&
        <Description
          className={className}
          dataTestId='extendedActionStatus'
          description={t<string>('Claimable')}
        />
      }
    </>
  );
}

export default React.memo(ExtendedStatus);
