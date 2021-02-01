// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Description from '../Description';
import { useTranslation } from '../translate';

function VotingLink (): React.ReactElement<string> {
  const { t } = useTranslation();

  return (
    <div>
      <a href='#/council/motions'>{t<string>('Voting')}</a>
      <Description description={t<string>('Go to motions panel')} />
    </div>
  );
}

export default React.memo(VotingLink);
