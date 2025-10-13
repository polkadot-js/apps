// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  withIcon?: boolean;
}

function SessionKeyInfo ({ children, className = '', withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <StyledArticle className={`${className} mark warning`}>
      {withIcon && <Icon icon='exclamation-triangle' />}
      The <strong>session pallet</strong> in Asset Hub is specifically for <strong>collator selection</strong>. You can no longer set session keys <strong> for your relay chain validators </strong> here.
      <br />
      <br />
      <p>As a validator, to manage your relay session keys, please navigate to the Relay Chain, set your session keys there, and then return here to continue with your staking actions.</p>
      {children}
    </StyledArticle>

  );
}

const StyledArticle = styled.article`
    max-width: 50vw;
    margin-inline: auto !important;

    .ui--Icon {
        color: rgba(255, 196, 12, 1);
        margin-right: 0.5rem;
    }
`;

export default React.memo(SessionKeyInfo);
