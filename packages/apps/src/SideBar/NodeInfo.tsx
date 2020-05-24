// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';
import { NodeName, NodeVersion } from '@polkadot/react-query';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgJson = require('../../package.json') as { version: string };

const uiInfo = `apps v${pkgJson.version}`;

function NodeInfo ({ className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <div className={className}>
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
  color: white;
  font-size: 0.75rem;
  opacity: 0.5;
  padding: 0 1.5rem 0 1.5rem;
  text-align: right;

  > div {
    margin-bottom: -0.125em;
    > div {
      display: inline-block;
    }

    &.spacer {
      margin-bottom: 0.5rem;
    }
  }
`);
