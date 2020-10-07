// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import Column from './Column';

interface Props {
  children: React.ReactNode;
  className?: string;
}

type ColumarType = React.ComponentType<Props> & {
  Column: React.ComponentType<Props>;
};

function Columar ({ children, className = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--Columnar ${className}`}>
      {children}
    </div>
  );
}

const ColumarExp = React.memo(styled(Columar)`
  display: flex;
  flex-wrap: wrap;

  .ui--Column {
    @media (min-width: 1025px) {
      max-width: 50%;
      min-width: 50%;
    }
  }
`) as unknown as ColumarType;

ColumarExp.Column = Column;

export default ColumarExp;
