// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

interface Props {
  content: React.ReactChild;
  className?: string;
}

function Toast ({ className, content }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      <p className='snackbar-content'>{content}</p>
    </div>
  );
}

export default styled(Toast)<{visible: boolean}>`
  position: fixed;
  display: ${({ visible }): string => visible ? 'block' : 'none'};
  height: 40px;
  width: 80px;
  text-align: center;
  vertical-align: middle;
  line-height: 7px;
  top: 300px;
  left: calc(50% - 50px);
  && {
    margin: auto;
    border-radius: 25px;
    background: #ECECEC;
  }
  .snackbar-content {
    font-family: Nunito, sans-serif;
    text-align: center;
    line-height: 40px;
  }
`;
