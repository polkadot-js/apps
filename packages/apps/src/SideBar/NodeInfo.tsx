// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { BareProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { withApi } from '@polkadot/react-api/with';
import { NodeName, NodeVersion } from '@polkadot/react-query';

interface Props extends ApiProps, BareProps {}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkgJson = require('../../package.json');

const uiInfo = `apps v${pkgJson.version}`;

function renderNode ({ isApiReady }: Props): React.ReactNode {
  if (!isApiReady) {
    return null;
  }

  return (
    <div>
      <NodeName />&nbsp;
      <NodeVersion label='v' />
    </div>
  );
}

function NodeInfo (props: Props): React.ReactElement<Props> {
  const { api, className } = props;

  return (
    <div className={className}>
      {renderNode(props)}
      <div>{api.libraryInfo.replace('@polkadot/', '')}</div>
      <div>{uiInfo}</div>
    </div>
  );
}

export default withApi(
  styled(NodeInfo)`
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
  `
);
