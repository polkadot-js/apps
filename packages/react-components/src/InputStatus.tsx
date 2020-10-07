// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
