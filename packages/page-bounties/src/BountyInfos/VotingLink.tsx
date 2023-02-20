// Copyright 2017-2023 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { styled } from '@polkadot/react-components';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function VotingLink ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <StyledA
      className={className}
      href='#/council/motions'
    >
      {t<string>('Voting')}
    </StyledA>
  );
}

const StyledA = styled.a`
  line-height: 0.85rem;
  font-size: var(--font-size-tiny);
  text-decoration: underline;
`;

export default React.memo(VotingLink);
