// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RuntimeVersion } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';
import { ChainImg } from '@polkadot/react-components';
import { useCall, useApi } from '@polkadot/react-hooks';
import { BestNumber, Chain } from '@polkadot/react-query';

import { useTranslation } from '../translate';

interface Props {
  className?: string;
  onClick?: () => void;
}

function ChainInfo ({ className, onClick }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const runtimeVersion = useCall<RuntimeVersion>(api.rpc.state.subscribeRuntimeVersion, []);

  return (
    <div
      className={`apps--SideBar-logo ${className} ui--highlight--border`}
      onClick={onClick}
    >
      <div className='apps--SideBar-logo-inner'>
        <ChainImg />
        <div className='info'>
          <Chain className='chain' />
          {runtimeVersion && (
            <div className='runtimeVersion'>{t('version {{version}}', { replace: { version: runtimeVersion.specVersion.toNumber() } })}</div>
          )}
          <BestNumber label='#' />
        </div>
      </div>
    </div>
  );
}

export default styled(ChainInfo)`
  border-top: 0.5rem solid transparent;
  cursor: pointer;
  padding: 0.75rem 1rem;
  margin: 0 0 0.5rem -0.75rem;

  .apps--SideBar-logo-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 10rem;

    img {
      height: 2.75rem;
      width: 2.75rem;
    }

    > div.info {
      color: white;
      opacity: 0.75;
      text-align: right;
      vertical-align: middle;

      > div.chain {
        font-size: 0.9rem;
        line-height: 1rem;
      }

      > div.runtimeVersion {
        font-size: 0.75rem;
        line-height: 1rem;
      }
    }
  }
`;
