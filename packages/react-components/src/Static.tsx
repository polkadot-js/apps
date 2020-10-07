// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from './types';

import React from 'react';

import Labelled from './Labelled';

interface Props extends BareProps {
  children?: React.ReactNode;
  defaultValue?: any;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  label?: React.ReactNode;
  value?: React.ReactNode;
  withLabel?: boolean;
}

function Static ({ children, className = '', defaultValue, help, isFull, isHidden, label, value, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      isHidden={isHidden}
      label={label}
      withLabel={withLabel}
    >
      <div className='ui--Static ui dropdown selection disabled'>
        {value || defaultValue}
        {children}
      </div>
    </Labelled>
  );
}

export default React.memo(Static);
