// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { isString } from '@polkadot/util';

import CopyButton from './CopyButton.js';
import Labelled from './Labelled.js';
import { styled } from './styled.js';

interface Props {
  children?: React.ReactNode;
  className?: string;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isMonospace?: boolean;
  isSmall?: boolean;
  isTrimmed?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  value?: React.ReactNode | string | null;
  withCopy?: boolean;
  withLabel?: boolean;
}

function Output ({ children, className = '', isDisabled, isError, isFull, isHidden, isMonospace, isSmall, isTrimmed, label, labelExtra, value, withCopy = false, withLabel }: Props): React.ReactElement<Props> {
  return (
    <StyledLabelled
      className={`${className} ui--Output`}
      isFull={isFull}
      isHidden={isHidden}
      isSmall={isSmall}
      label={label}
      labelExtra={labelExtra}
      withLabel={withLabel}
    >
      <div className={`ui--output ui dropdown selection ${isError ? ' error' : ''}${isMonospace ? ' monospace' : ''}${isDisabled ? 'isDisabled' : ''}`}>
        {isTrimmed && isString(value) && (value.length > 512)
          ? `${value.slice(0, 256)}…${value.slice(-256)}`
          : value
        }
        {children}
      </div>
      {withCopy && (
        <CopyButton value={value} />
      )}
    </StyledLabelled>
  );
}

const StyledLabelled = styled(Labelled)`
  .ui.selection.dropdown.ui--output.isDisabled {
    background: transparent;
    border-style: dashed;
    opacity: 1;
  }

  pre {
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export default React.memo(Output);
