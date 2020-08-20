// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  icon?: boolean;
  isError?: boolean;
  isValid?: boolean;
  text: React.ReactNode;
}

function InputStatus ({ className, isError = false, isValid = false, text = null }: Props): React.ReactElement<Props> {
  return (
    <div className={classes(className, isError && 'isError')}>
      {!!text && (
        <Icon name={!isValid ? 'warning circle' : 'check circle'} />
      )}
      {text}
    </div>
  );
}

export default React.memo(styled(InputStatus)`
  color: var(--grey60);
  font-size: 0.9rem;
  height: 1rem;
  margin-top: 0.25rem;
  width: 100%;

  &.isValid {
    color: var(--green-primary);
  }

  &.isError {
    color: var(--red-primary);
  }
`);
