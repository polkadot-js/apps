// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React, { MouseEvent } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { classes } from '@canvas-ui/react-util';

import { useTranslation } from './translate';

interface Props extends BareProps {
  errorText?: React.ReactNode;
  isError?: boolean;
  onRemove: (event: MouseEvent<HTMLDivElement>) => void;
  text: React.ReactNode;
}

function FileSupplied ({ className, errorText, isError, onRemove, text }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <div className={classes(isError && 'isError', className)}>
      <Icon
        className='file-supplied'
        name='file outline'
        size='large'
      />
      <div className='info'>
        {text}
        {isError && (
          <div className='error'>
            {errorText || t<string>('Invalid file supplied')}
          </div>
        )}
      </div>
      <Icon
        className='file-remove'
        name='trash alternate outline'
        onClick={onRemove}
      />
    </div>
  );
}

export default React.memo(styled(FileSupplied)`
  display: flex;
  align-items: center;
  width: 100%;

  .info {
    flex: 1 0;
    min-width: 13rem;
    padding-left: 0.75rem;

    .error {
      color: --var(red-secondary);
      font-size: 0.9rem;
      line-height: 0.9rem;
    }
  }

  i.icon.file-supplied {
    color: var(--blue-primary);
  }

  i.icon.file-remove {
    color: var(--grey70);
    cursor: pointer;
    height: 100%;

    &:hover {
      color: var(--grey90);
    }
  }

  &.isError {
    i.icon.file-supplied {
      color: var(--red-primary);
    }
  }
`);
