// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

import React, { useContext } from 'react';
import styled from 'styled-components';
import { ApiContext } from '@polkadot/react-api';
import { NodeName, NodeVersion } from '@polkadot/react-query';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgJson = require('../../package.json');

const uiInfo = `apps v${pkgJson.version}`;

function NodeInfo ({ className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useContext(ApiContext);

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

export default styled(NodeInfo)`
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

  .rx--updated {
    background: inherit !important;
  }
`;
