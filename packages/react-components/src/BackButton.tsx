// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import Icon from './Icon';
import styled from 'styled-components';

interface Props {
  className?: string;
  onClick: () => void;
}

function BackButton ({ className, onClick }: Props): React.ReactElement<Props> {
  return (
    <button className={className}
      onClick={onClick}>
      <Icon icon='arrow-left' />
    </button>
  );
}

export default React.memo(styled(BackButton)`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 42px;
  height: 40px;
  border: 1px solid #C2C2C2;
  border-radius: 4px;
  color: #8B8B8B;
  cursor: pointer;
`);
