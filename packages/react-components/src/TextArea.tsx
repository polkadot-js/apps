// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { TextareaHTMLAttributes, useCallback } from 'react';
import styled from 'styled-components';

import { Labelled } from '.';
import { ThemeProps } from './types';

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

interface TextInputProps extends TextareaHTMLAttributes<any>{
  withError?: boolean;
}

const TextInput = ({ withError, ...textAreaProps }: TextInputProps) => <textarea
  {...textAreaProps}
  className={[textAreaProps.className, withError ? 'ui-textArea-withError' : ''].join(' ')}
/>;

const TextAreaInput = styled(TextInput)(({ theme }: ThemeProps) => `
  background: ${theme.bgInput};
  border-radius: 4px;
  border: 1px solid #DDE1EB;
  box-sizing: border-box;
  color: ${theme.color};
  display: block;
  font-size: 1.15rem;
  outline: none;
  padding: 1.75rem 3rem 0.75rem 1.5rem;
  resize: none;
  width: 100%;

  &:read-only {
    background: ${theme.bgInverse};
    box-shadow: none;
    outline: none;
  }

  &.ui-textArea-withError {
    background: ${theme.bgInputError};
    color: ${theme.colorError};
  }
`);

interface TextAreaWithDropdownProps {
  children?: React.ReactNode;
  isError?: boolean;
  isReadOnly?: boolean;
  rowsCount?: number;
  onChange?: (value: string) => void;
  value?: string;
  id: string;
}

function TextAreaWithDropdown ({ children, id, isError, isReadOnly, onChange, rowsCount, value }: TextAreaWithDropdownProps): React.ReactElement<TextAreaWithDropdownProps> {
  const _onChange = useCallback(
    ({ target: { value } }: React.ChangeEvent<HTMLTextAreaElement>): void => {
      onChange && onChange(value);
    },
    [onChange]
  );

  return (
    <>
      <TextAreaInput
        autoCapitalize='off'
        autoCorrect='off'
        autoFocus={false}
        id={id}
        onChange={_onChange}
        readOnly={isReadOnly}
        rows={rowsCount || 2}
        spellCheck={false}
        value={value}
        withError={isError}
      />
      {children}
    </>
  );
}

function TextArea ({ children, className, help, isError, isReadOnly, label, onChange, seed, withLabel }: Props): React.ReactElement<Props> {
  return (
    <Labelled
      className={className}
      help={help}
      label={label}
      withLabel={withLabel}
    >
      <div className='TextAreaWithDropdown'>
        <TextAreaWithDropdown
          id='printJS-seed'
          isError={isError}
          isReadOnly={isReadOnly}
          onChange={onChange}
          value={seed}
        >
          {children}
        </TextAreaWithDropdown>
      </div>
    </Labelled>
  );
}

export default React.memo(styled(TextArea)(({ theme }: ThemeProps) => `
  .TextAreaWithDropdown {
    display: flex;
    textarea {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }
    
    textarea:read-only ~ .ui.buttons {
      .ui.selection.dropdown {
        background: ${theme.bgInverse};
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
