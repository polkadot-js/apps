// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import CopyButton from './CopyButton';
import Labelled from './Labelled';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultValue?: unknown;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isSmall?: boolean;
  label?: React.ReactNode;
  value?: React.ReactNode;
  withCopy?: boolean;
  withLabel?: boolean;
}

function Static ({ children, className = '', defaultValue, help, isFull, isHidden, isSmall, label, value, withCopy, withLabel }: Props): React.ReactElement<Props> {
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
      {withCopy && (
        <CopyButton value={value || defaultValue} />
      )}
    </Labelled>
  );
}

export default React.memo(Static);
