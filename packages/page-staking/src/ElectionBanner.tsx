// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';

import { useTranslation } from './translate';

interface Props {
  isInElection?: boolean;
}

function ElectionBanner ({ isInElection }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!isInElection) {
    return null;
  }

  return (
    <article className='warning nomargin'>
      {t<string>('There is currently an ongoing election for new validator candidates. As such staking operations are not permitted.')}
    </article>
  );
}

export default React.memo(ElectionBanner);
