// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function VotingLink ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <a className={className}
      href='#/council/motions'>
      {t<string>('Voting')}
    </a>
  );
}

export default React.memo(styled(VotingLink)`
  line-height: 0.85rem;
  font-size: 0.7rem;
  text-decoration: underline;
`);
