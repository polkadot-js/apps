// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
  const { api } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(api.rpc.state.subscribeRuntimeVersion);
  const { ipnsChain } = useIpfs();
  const [isEndpointsVisible, toggleEndpoints] = useToggle();
  const canToggle = !ipnsChain;

  return (
    <div className={className}>
      <div
        className={`apps--SideBar-logo-inner${canToggle ? ' isClickable' : ''}`}
        onClick={toggleEndpoints}
      >
        <ChainImg />
        <div className='info ui--media-1000'>
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
      flex: 0;
      height: 3rem;
      margin-right: 0.5rem;
      width: 3rem;
    }

    .ui--Icon.dropdown,
    > div.info {
      color: white;
      opacity: 0.85;
      text-align: right;
      vertical-align: middle;
    }

    .ui--Icon.dropdown {
      flex: 0;
      margin: 0;
      width: 1rem;
    }

    > div.info {
      flex: 1;
      padding-right: 0.5rem;

      > div.bestNumber,
      > div.chain {
        font-size: 0.9rem;
        line-height: 1.2;
      }

      > div.runtimeVersion {
        font-size: 0.75rem;
        line-height: 1.2;
      }
    }
  }
`);
