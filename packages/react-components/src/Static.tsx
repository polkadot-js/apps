// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import CopyButton from './CopyButton.js';
import Labelled from './Labelled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  copyValue?: string;
  defaultValue?: React.ReactNode;
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

function Static ({ children, className = '', copyValue, defaultValue, isFull, isHidden, isSmall, label, value, withCopy, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
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
        <CopyButton value={copyValue || value || defaultValue} />
      )}
    </Labelled>
  );
}

export default React.memo(Static);
