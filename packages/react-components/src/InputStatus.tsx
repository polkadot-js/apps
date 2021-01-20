// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import React from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { BareProps } from './types';

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
        <Icon icon={!isValid ? 'exclamation-circle' : 'check-circle'} />
      )}
      {text}
    </div>
  );
}

export default React.memo(styled(InputStatus)`
  color: var(--grey60);
  font-size: 0.875rem;
  height: 1rem;
  margin-top: 0.75rem;
  width: 100%;

  &.isValid {
    color: var(--green-primary);
  }

  &.isError {
    color: var(--red-primary);
  }
`);
