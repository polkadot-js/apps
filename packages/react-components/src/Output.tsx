// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Codec, TypeDef, TypeDefInfo } from '@polkadot/types/types';
import { BareProps } from './types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import AddressSmall from './AddressMini';
import CopyButton from './CopyButton';
import Data from './Data';
import Icon from './Icon';
import Labelled from './Labelled';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  children?: React.ReactNode;
  help?: React.ReactNode;
  isError?: boolean;
  isFull?: boolean;
  isHidden?: boolean;
  isMonospace?: boolean;
  isTrimmed?: boolean;
  label?: React.ReactNode;
  type?: TypeDef | null;
  value?: Codec;
  withCopy?: boolean;
  withLabel?: boolean;
}

function Output ({ children, className = '', help, isError, isFull, isHidden, isMonospace, isTrimmed, label, type, value, withCopy = false, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      isFull={isFull}
      isHidden={isHidden}
      label={label}
      withLabel={withLabel}
    >
      <div className={classes('ui--output', isError && 'error', 'monospace')}>
        <Data isTrimmed={isTrimmed}
          type={type}
          value={value} />
        {children}
        {withCopy
          ? (
            <CopyButton
              className='copy-output'
              value={value?.toString() || ''}
              withButton={false}
            >
              <Icon
                className='copy-output'
                name='copy outline'
              />
            </CopyButton>
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

  .copy-output {
    float: right;
  
    i.icon {
      font-size: 0.875rem;
      color: var(--grey60);
      margin-right: 0;

      &:hover {
        color: var(--white);
      }
    }
  }
`);
