// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import ChainInfo from '../SideBar/ChainInfo';

interface Props {
  className?: string;
}

function Menu ({ className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`${className} ui--highlight--border`}>
      <ChainInfo
        onClick={(): void => {
          console.error('clicked');
        }}
      />
    </div>
  );
}

export default React.memo(styled(Menu)`
  align-items: center;
  background: #4f5255;
  border-top: 0.5rem solid transparent;
  box-sizing: border-box;
  display: flex;
  z-index: 100;

  // position: fixed;
  // top: 0;
  // left: 0;
  // right: 0;
`);
