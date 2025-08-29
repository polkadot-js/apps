// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { Icon, styled } from '@polkadot/react-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  withIcon?: boolean;
}

function StakingAsyncOverview ({ children, className = '', withIcon = true }: Props): React.ReactElement<Props> {
  return (
    <StyledArticle className={`${className} mark warning`}>
      {withIcon && <Icon icon='exclamation-triangle' />}
      <strong>Staking Async is Polkadot&apos;s staking system</strong> which elects validators <em>for the Relay Chain</em>, <em>on AssetHub</em>.
      The actual collators of the AssetHub parachain are managed by the collator-selection system. To nominate a Relay Chain validator, please use this page and everything works as before. To setup a validator, please see{' '}
      <a
        href='https://docs.google.com/document/d/1X4EjL-7he70vtUumNhEqnUs7XdTCDj8TQpGJhNuAklY/edit?tab=t.0#heading=h.xh97bpw96bkk'
        rel='noreferrer'
        target='_blank'
      >
    this guide
      </a>.
      <br />
      <br />
  For more information about Staking Async and AssetHub migration, please see the{' '}
      <a
        href='https://docs.google.com/document/d/1XR3vL2p4QV0wC7FrlC8eN-q62BqNFTFElbj21wEmMGg/edit?tab=t.tyioldyxov9u'
        rel='noreferrer'
        target='_blank'
      >
    Asset Hub Migration FAQ
      </a>.
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

export default React.memo(StakingAsyncOverview);
