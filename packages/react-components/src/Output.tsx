// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';
import styled from 'styled-components';

import CopyButton from './CopyButton';
import Labelled from './Labelled';

interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isMonospace?: boolean;
  isSmall?: boolean;
  isTrimmed?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  value?: string;
  withCopy?: boolean;
  withLabel?: boolean;
}

function Output ({ children, className = '', help, isDisabled, isError, isFull, isHidden, isMonospace, isSmall, isTrimmed, label, labelExtra, value, withCopy = false, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      isHidden={isHidden}
      isSmall={isSmall}
      label={label}
      labelExtra={labelExtra}
      withLabel={withLabel}
    >
      <div className={`ui--output ui dropdown selection ${isError ? ' error' : ''}${isMonospace ? ' monospace' : ''}${isDisabled ? ' disabled' : ''}`}>
        {isTrimmed && value && (value.length > 256)
          ? `${value.substr(0, 96)}…${value.substr(-96)}`
          : value
        }
        {children}
      </div>
      {withCopy && (
        <CopyButton value={value} />
      )}
    </Labelled>
  );
}

export default React.memo(styled(Output)`
  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`);
