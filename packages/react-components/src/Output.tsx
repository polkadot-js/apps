// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import styled from 'styled-components';

import CopyButton from './CopyButton';
import Labelled from './Labelled';
import { classes } from './util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isMonospace?: boolean;
  isTrimmed?: boolean;
  label?: React.ReactNode;
  value?: string;
  withCopy?: boolean;
  withLabel?: boolean;
}

function Output ({ children, className = '', help, isError, isFull, isHidden, isMonospace, isTrimmed, label, value, withCopy = false, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      isHidden={isHidden}
      label={label}
      withLabel={withLabel}
    >
      <div className={classes('ui--output', isError && 'error', isMonospace && 'monospace')}>
        {isTrimmed && value && (value.length > 256)
          ? `${value.substr(0, 96)}…${value.substr(-96)}`
          : value
        }
        {children}
        {withCopy
          ? (
            <CopyButton
              className='ui--output-button'
              value={value}
            />
          )
          : null
        }
      </div>
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
