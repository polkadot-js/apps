// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { TextareaHTMLAttributes, useCallback } from 'react';

import { Labelled } from '@polkadot/react-components';
import styled from 'styled-components';

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

const TextAreaInput = styled(TextInput)`
  background: #FAFAFA;
  border-radius: 4px;
  border: 1px solid #DDE1EB;
  box-sizing: border-box;
  color: #242529;
  display: block;
  font-size: 16px;
  outline: none;
  padding: 1.75rem 3rem 0.75rem 1.5rem;
  resize: none;
  width: 100%;

  &:read-only {
    background: #1A1B20;
    box-shadow: none;
    outline: none;
  }

  &.ui-textArea-withError {
    border-color: #E42F2F;
    color: #E42F2F;
  }
`;

interface TextAreaWithDropdownProps {
  children?: React.ReactNode;
  isError?: boolean;
  isFocused?: boolean;
  isReadOnly?: boolean;
  rowsCount?: number;
  onChange?: (value: string) => void;
  value?: string;
  id: string;
}

function TextAreaWithDropdown ({ children, id, isError, isFocused, isReadOnly, onChange, rowsCount, value }: TextAreaWithDropdownProps): React.ReactElement<TextAreaWithDropdownProps> {
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
        autoFocus={isFocused}
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

export default React.memo(styled(TextArea)`
  .TextAreaWithDropdown {
    display: flex;
    textarea {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      background: #fff;
      border-color: #DFDFDF;
      border-right: none;
    }
    .ui.selection.dropdown {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
`);
