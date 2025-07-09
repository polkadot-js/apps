// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props } from '@polkadot/react-components/types';

import React from 'react';

import { packageInfo } from '@polkadot/apps-config';
import { styled } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { NodeName, NodeVersion } from '@polkadot/react-query';

const appsVersion = `apps v${packageInfo.version.replace('-x', '')}`;

function NodeInfo ({ className = '' }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <StyledDiv className={`${className} media--1400 highlight--color-contrast ui--NodeInfo`}>
      {isApiReady && (
        <div className='node'>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
      )}
      <div>{api.libraryInfo.replace('@polkadot/', '')}</div>
      <div>{appsVersion}</div>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  background: transparent;
  font-size: var(--font-size-tiny);
  line-height: 1.2;
  padding: 0 0 0 1rem;
  text-align: right;

  > div {
    margin-bottom: -0.125em;

    > div {
      display: inline-block;
    }
  }
`;

export default React.memo(NodeInfo);
