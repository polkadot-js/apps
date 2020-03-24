// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps as Props } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { useApi } from '@polkadot/react-hooks';
import { NodeName, NodeVersion } from '@polkadot/react-query';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgJson = require('../../package.json');

const uiInfo = `apps v${pkgJson.version}`;

const NodeTag = styled.div`
  display: flex;

  div {
    margin-right: 0.5rem;
  }
`;

function NodeInfo ({ className }: Props): React.ReactElement<Props> {
  const { api, isApiReady } = useApi();

  return (
    <div className={className}>
      {isApiReady && (
        <NodeTag>
          <NodeName /><NodeVersion label='v' />
        </NodeTag>
      )}
      <div>{api.libraryInfo.replace('@polkadot/', '')}</div>
      <div>{uiInfo}</div>
    </div>
  );
}

export default styled(NodeInfo)`
  font-size: 12px;
  width: 100%;
`;
