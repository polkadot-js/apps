// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { FundIndex } from '@polkadot/types/interfaces';

import React from 'react';

import { useTranslation } from './translate';

interface Props {
  className?: string;
  fundIndexes: FundIndex[];
}

function Funds ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      {t('Nothing here yet')}
    </div>
  );
}

export default React.memo(Funds);
