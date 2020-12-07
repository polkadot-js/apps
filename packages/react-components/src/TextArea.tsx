// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from './types';

import React, { useCallback } from 'react';
import styled from 'styled-components';

import Labelled from './Labelled';

interface Props {
  children?: React.ReactNode;
  className?: string;
  help?: React.ReactNode;
  isError?: boolean;
  isReadOnly?: boolean;
  label?: React.ReactNode;
  onChange?: (arg: string) => void;
  seed?: string;
  withLabel?: boolean;
}

function TextArea ({ children, className, help, isError, isReadOnly, label, onChange, seed, withLabel }: Props): React.ReactElement<Props> {
  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
      onChange && onChange(value);
    },
    [onChange]
  );

  return (
    <Labelled
      className={className}
      help={help}
      label={label}
      withLabel={withLabel}
    >
      <div className='TextAreaWithDropdown'>
        <textarea
          autoCapitalize='off'
          autoCorrect='off'
          autoFocus={false}
          className={isError ? 'ui-textArea-withError' : ''}
          onChange={_onChange}
          readOnly={isReadOnly}
          rows={2}
          spellCheck={false}
          value={seed}
        />
        {children}
      </div>
    </Labelled>
  );
}

export default React.memo(styled(TextArea)(({ theme }: ThemeProps) => `
  .TextAreaWithDropdown {
    display: flex;
    textarea {
      border-radius: 0.25rem 0 0 0.25rem;
      border: 1px solid #DDE1EB;
      border-right: none;
      background: ${theme.bgInput};
      box-sizing: border-box;
      color: ${theme.color};
      display: block;
      outline: none;
      padding: 1.75rem 3rem 0.75rem 1.5rem;
      resize: none;
      width: 100%;

      &:read-only {
        background: ${theme.bgInverse};
        box-shadow: none;
        outline: none;

        ~ .ui.buttons > .ui.selection.dropdown {
          background: ${theme.bgInverse};
        }
      }

      &.ui-textArea-withError {
        background: ${theme.bgInputError};
        color: ${theme.colorError};
      }
    }

    & > .ui.buttons > .ui.button.floating.selection.dropdown {
      border: 1px solid #DDE1EB;
      border-left: none;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      & > .dropdown.icon {
        top: 2rem;
      }
    }
  }
`));
