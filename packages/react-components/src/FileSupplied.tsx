// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { classes } from '@canvas-ui/react-util';
import { faFile, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import React, { MouseEvent } from 'react';
import styled from 'styled-components';

import Icon from './Icon';
import { useTranslation } from './translate';
import { BareProps } from './types';

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
        icon={faFile}
        size='2x'
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
        icon={faTrashAlt}
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

  .svg-inline--fa.file-supplied {
    color: var(--blue-primary);
  }

  .svg-inline--fa.file-remove {
    color: var(--grey70);
    cursor: pointer;
    height: 100%;

    &:hover {
      color: var(--grey80);
    }
  }

  &.isError {
    .svg-inline--fa.file-supplied {
      color: var(--red-primary);
    }
  }
`);
