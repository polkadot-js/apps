// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  withIcon?: boolean;
}

function MarkPoolsWarning ({ children, className = '', withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <StyledArticle className={`${className} mark warning`}>
      {withIcon && <Icon icon='exclamation-triangle' />}
      <strong>Nomination Pools are evolving!</strong>
      <br />
      <br />
      Soon you will be able to participate in a pool and in OpenGov with your pooled funds!
      <br />
      <br />
      You do not need to do anything, unless you are participating in a pool and also staking solo from the same account.
      <br />
      In this case, please check
      <a
        href='https://support.polkadot.network/support/solutions/articles/65000188140-changes-for-nomination-pool-members-and-opengov-participation'
        rel='noreferrer'
        target='_blank'
      > this article </a>
       on the actions you need to take as soon as possible.
      {children}
    </StyledArticle>
  );
}

const StyledArticle = styled.article`
  .ui--Icon {
    color: rgba(255, 196, 12, 1);
    margin-right: 0.5rem;
  }
`;

export default React.memo(MarkPoolsWarning);
