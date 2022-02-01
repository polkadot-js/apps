// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BareProps as Props } from '@polkadot/react-components/types';

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
    <div className={`${className} media--1400 highlight--color-contrast ui--NodeInfo`}>
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
  background: transparent;
  font-size: 0.9rem;
  line-height: 1.2;
  padding: 0 0 0 1rem;
  text-align: right;

  > div {
    margin-bottom: -0.125em;

    > div {
      display: inline-block;
    }
  }
`);
