// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Description from '../Description';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function VotingLink ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={className}>
      <a href='#/council/motions'>{t<string>('Voting')}</a>
      <Description description={t<string>('Go to motions panel')} />
    </div>
  );
}

export default React.memo(styled(VotingLink)`
  margin: 0 1rem 0 0
`);
