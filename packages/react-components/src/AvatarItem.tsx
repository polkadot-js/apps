// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

interface Props {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  icon: React.ReactNode;
  isBig?: boolean;
  title: React.ReactNode;
  subtitle: React.ReactNode;
}

function AvatarItem ({ children, className = '', icon, isBig, subtitle, title }: Props): React.ReactElement<Props> {
  return (
    <div className={['ui--AvatarItem', className, isBig && 'big'].join(' ')}>
      <div className='ui--AvatarItem-icon'>
        {icon}
      </div>
      <div className='ui--AvatarItem-details'>
        <div className='ui--AvatarItem-title'>
          {title}
        </div>
        <div className='ui--AvatarItem-subtitle'>
          {subtitle}
        </div>
      </div>
      {children}
    </div>
  );
}

export default React.memo(styled(AvatarItem)`
  & {
    display: flex;
    align-items: center;

    .ui--AvatarItem-icon {
      width: 2.4rem;
      height: 2.4rem;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > * {
        border-radius: 50%;
        width: 100%;
        height: 100%;
      }

      > .ui--Icon {
        color: white;
        line-height: 2.4rem;
        margin-right: 0 !important;
      }

      > img {
      }
    }

    .ui--AvatarItem-details {
      flex: 1;

      .ui--AvatarItem-title {
        font-weight: bold;
        font-size: 1rem;
      }

      .ui--AvatarItem-subtitle {
        color: rgba(100, 100, 100, 0.6);
        font-size: 1rem;
      }
    }

    &.big {
      .ui--AvatarItem-icon {
        width: 3.4rem;
        height: 3.4rem;
        margin-right: 0.6rem;

        > .ui--Icon {
          font-size: 1.6rem;
          line-height: 3.4rem;
        }
      }

      .ui--AvatarItem-details {
        .ui--AvatarItem-name {
          font-size: 1.4rem;
          line-height: 1.4rem;
        }
      }
    }
  }
`);
