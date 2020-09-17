// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Labelled from './Labelled';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: any;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isSmall?: boolean;
  label?: React.ReactNode;
  value?: React.ReactNode;
  withLabel?: boolean;
}

function Static ({ children, className = '', defaultValue, help, isFull, isHidden, isSmall, label, value, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      isHidden={isHidden}
      isSmall={isSmall}
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
