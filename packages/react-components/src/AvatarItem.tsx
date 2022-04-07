// Copyright 2017-2022 @polkadot/react-components authors & contributors
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
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .ui--AvatarItem-details {
    .ui--AvatarItem-title {
      font-weight: 600;
      font-size: 1rem;
    }

    .ui--AvatarItem-subtitle {
      font-weight: var(--font-weight-normal);
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
`);
