// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// Unused atm, experiment as a replacement for NodeInfo on the SideBar

import React from 'react';
import styled from 'styled-components';
import { BestNumber, Chain, NodeName, NodeVersion } from '@polkadot/react-query';

interface Props {
  className?: string;
}

function TopBar ({ className }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <div>
        <NodeName />&nbsp;
        <NodeVersion label='v' />
      </div>
      <div>
        <Chain />&nbsp;
        <BestNumber label='#' />
      </div>
    </div>
  );
}

export default React.memo(styled(TopBar)`
  background: #f2f2f2;
  font-size: 0.85rem;
  line-height: 1rem;
  overflow: hidden;
  padding: 0.5rem 1rem;
  position: fixed;
  right: 0;
  text-align: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  top: 0;

  div {
    display: inline-block;
    vertical-align: middle;
  }

  > div {
    border-left: 1px solid #ccc;
    padding: 0 0.5rem;

    &:first-child {
      border-width: 0;
    }
  }
`);
