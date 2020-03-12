// Copyright 2017-2020 @polkadot/app-parachains authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveParachainInfo } from '@polkadot/api-derive/types';

import React from 'react';
import styled from 'styled-components';

import { useTranslation } from './translate';
import { parachainName, parachainOwner } from './util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  info: DeriveParachainInfo | null;
  isBig?: boolean;
}

function ParachainInfo ({ children, className, isBig, info }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={[className, isBig ? 'big' : ''].join(' ')}>
      <div className='chain-icon'>
        {
          info?.icon
            ? (
              <img src={info.icon} />
            )
            : (
              <i className='icon chain fitted' />
            )
        }
      </div>
      <div className='details'>
        <div className='name'>
          {parachainName(t, info)}
        </div>
        <div className='owner'>
          {parachainOwner(t, info)}
        </div>
      </div>
      {children}
    </div>
  );
}

export default React.memo(styled(ParachainInfo)`
  & {
    display: flex;
    align-items: center;

    .chain-icon {
      width: 2.4rem;
      height: 2.4rem;
      background: #e03997;
      border-radius: 50%;
      color: white;
      margin-right: 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;

      > * {
        width:100%;
      }

      > i.icon {
        height: auto !important;
      }

      > img {
        height: 100%;
      }
    }

    .details {
      flex: 1;

      .name {
        font-weight: bold;
        font-size: 1rem;
      }

      .owner {
        color: rgba(100, 100, 100, 0.6);
        font-size: 1rem;
      }
    }

    &.big {
      .chain-icon {
        width: 3.4rem;
        height: 3.4rem;
        margin-right: 0.6rem;

        > i.icon {
          font-size: 1.6rem;
        }
      }

      .details {
        .name {
          font-size: 1.4rem;
          line-height: 1.4rem;
        }
      }
    }
  }
`);
