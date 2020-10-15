// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';
import { NodeName, NodeVersion } from '@polkadot/react-query';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgJson = require('../../package.json') as { version: string };

const uiInfo = `apps v${pkgJson.version}`;

function NodeInfo ({ className = '' }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <div className={`${className} media--1400`}>
      {isApiReady && (
        <div>
          <NodeName />&nbsp;
          <NodeVersion label='v' />
        </div>
      )}
      <div>{api.libraryInfo.replace('@polkadot/', '')}</div>
      <div>{uiInfo}</div>
    </div>
  );
}

export default React.memo(styled(NodeInfo)`
  position: absolute;
  top: 6.3rem;
  right: 5.1rem;
  z-index: 10;
  text-align: right;
  font-weight: 600;
  font-size: 0.55rem;
  line-height: 0.7rem;
  text-align: right;
  color: #8B8B8B;

  > div {
    margin-bottom: -0.125em;

    > div {
      display: inline-block;
    }
  }
`);
