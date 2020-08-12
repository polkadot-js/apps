// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RuntimeVersion } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { ChainImg, Icon } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { BestNumber, Chain } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  isToggled?: boolean;
  onClick?: () => void;
}

function ChainInfo ({ className = '', isToggled, onClick }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(api.rpc.state.subscribeRuntimeVersion, []);

  return (

    <div className={className}>
      <div className='apps--Sidebar-top'>{'polkadot{.js}'}</div>
      <div
        className='apps--SideBar-logo'
        onClick={onClick}
      >
        <p className='apps--SideBar-label'>Network:</p>
        <div className='apps--SideBar-logo-inner'>
          <ChainImg />
          <div className='info'>
            <Chain className='chain' />
            {runtimeVersion && (
              <div className='runtimeVersion'>{t<string>('version {{version}}', { replace: { version: runtimeVersion.specVersion.toNumber() } })}</div>
            )}
            <BestNumber label='#' />
          </div>
          {onClick && (
            <Icon
              className='dropdown'
              icon={isToggled ? 'caret-right' : 'caret-down'}
            />
          )}
        </div>
    <div
      className={`apps--SideBar-logo${onClick ? ' isClickable' : ''} ${className} ui--highlight--border`}
      onClick={onClick}
    >
      <div className='apps--SideBar-logo-inner'>
        <ChainImg />
        <div className='info'>
          <Chain className='chain' />
          {runtimeVersion && (
            <div className='runtimeVersion'>{t<string>('version {{version}}', { replace: { version: runtimeVersion.specVersion.toNumber() } })}</div>
          )}
          <BestNumber label='#' />
        </div>
        {onClick && (
          <Icon
            className='dropdown'
            icon={isToggled ? 'caret-right' : 'caret-down'}
          />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(ChainInfo)`
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
  padding: 0.75rem;
  margin: 0 0 0.5rem -1rem;

  .apps--Sidebar-top {
    padding: 18px 24px;
    font-size: 20px;
    line-height: 27px;
    color: #FFFFFF;
    background: #000000;
  }

  .apps--SideBar-label {
    margin-bottom: 4px;
    font-weight: 800;
    font-size: 10px;
    line-height: 14px;
    text-transform: uppercase;
    color: #8B8B8B;
  }

  .apps--SideBar-logo {
    padding: 8px 28px 10px 24px;
    background: #1A1B20;
  }

  &.isClickable {
    cursor: pointer;
  }

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 10.5rem;

    img {
      flex: 0;
      height: 35px;
      width: 35px;
      margin-right: 7px;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    > svg {
      color: #fff;
    }

    > div.info {
      flex: 1;
      text-align: left;
      font-size: 10px;
      line-height: 14px;
      letter-spacing: -0.01em;
      color: #8B8B8B;

      > div.chain {
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: #FFFFFF;
      }
    }
  }
`);
