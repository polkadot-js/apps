// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
