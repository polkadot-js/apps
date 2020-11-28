// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { RuntimeVersion } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { ChainImg, Icon } from '@polkadot/react-components';
import { useApi, useCall, useIpfs, useToggle } from '@polkadot/react-hooks';
import { BestNumber, Chain } from '@polkadot/react-query';

import Endpoints from '../Endpoints';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
}

function ChainInfo ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api, isApiReady } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(isApiReady && api.rpc.state.subscribeRuntimeVersion);
  const { ipnsChain } = useIpfs();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const canToggle = !ipnsChain;

  return (
    <div className={className}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''} highlight--color-contrast`}
        onClick={toggleEndpoints}
      >
        <ChainImg />
        <div className='info media--1000'>
          <Chain className='chain' />
          {runtimeVersion && (
            <div className='runtimeVersion'>{t<string>('version {{version}}', { replace: { version: runtimeVersion.specVersion.toNumber() } })}</div>
          )}
          <BestNumber
            className='bestNumber'
            label='#'
          />
        </div>
        {canToggle && (
          <Icon
            className='dropdown'
            icon={isEndpointsVisible ? 'caret-right' : 'caret-down'}
          />
        )}
      </div>
      {isEndpointsVisible && (
        <Endpoints onClose={toggleEndpoints} />
      )}
    </div>
  );
}

export default React.memo(styled(ChainInfo)`
  box-sizing: border-box;
  padding: 0.75rem 1rem 0.75rem 1.5rem;
  margin: 0;

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;

    &.isClickable {
      cursor: pointer;
    }

    img {
      height: 3rem;
      margin-right: 0.5rem;
      width: 3rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    .info {
      flex: 1;
      padding-right: 0.5rem;

      .bestNumber,
      .chain {
        font-size: 0.9rem;
        line-height: 1.2;
      }

      .runtimeVersion {
        font-size: 0.75rem;
        line-height: 1.2;
      }
    }
  }
`);
