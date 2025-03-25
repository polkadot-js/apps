// Copyright 2017-2025 @polkadot/app-staking authors & contributors
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
      <strong>Nomination Pools have evolved!</strong>
      <br />
      <br />
      You can now participate in both a nomination pool and OpenGov using your pooled funds!
      <br />
      <br />
      However, if you&apos;re staking solo from the same account while being part of a nomination pool, you might encounter the <strong>NotMigrated</strong> error.
      <br />
      To resolve this, please refer to{' '}
      <a
        href='https://support.polkadot.network/support/solutions/articles/65000188140'
        rel='noreferrer'
        target='_blank'
      >
      this article
      </a> for the necessary steps to take.
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
