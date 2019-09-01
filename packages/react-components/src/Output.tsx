// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import CopyButton from './CopyButton';
import Labelled from './Labelled';
import { classes } from './util';

interface Props extends BareProps {
  children?: React.ReactNode;
  help?: React.ReactNode;
  isError?: boolean;
  isHidden?: boolean;
  isMonospace?: boolean;
  label?: React.ReactNode;
  value?: any;
  withCopy?: boolean;
  withLabel?: boolean;
}

export default function Output ({ className, children, help, isError, isHidden, isMonospace, label, style, value, withCopy = false, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isHidden={isHidden}
      label={label}
      style={style}
      withLabel={withLabel}
    >
      <div className={classes('ui--output', isError && 'error', isMonospace && 'monospace')}>
        {value}
        {children}
        {
          withCopy
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
