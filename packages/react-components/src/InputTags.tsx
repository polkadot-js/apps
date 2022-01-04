// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useContext } from 'react';
import store from 'store';
import styled, { ThemeContext } from 'styled-components';

import { ThemeDef } from '@polkadot/react-components/types';

import Dropdown from './Dropdown';

interface Option {
  key: string;
  text: string;
  value: string;
}

interface Props {
  allowAdd?: boolean;
  className?: string;
  defaultValue?: string[];
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  label?: React.ReactNode;
  onBlur?: () => void;
  onChange?: (value: string[]) => void;
  onClose?: () => void;
  openOnFocus?: boolean;
  placeholder?: string;
  searchInput?: {autoFocus: boolean};
  value?: string[];
  withLabel?: boolean;
}

function loadTags (): string[] {
  return ((store.get('tags') as string[]) || ['Default']).sort();
}

function valueToOption (value: string): Option {
  return { key: value, text: value, value };
}

const tags = loadTags();
const options = tags.map(valueToOption);

function saveTags (tags: string[]): void {
  store.set('tags', tags.sort());
}

function onAddTag (value: string): void {
  tags.push(value);

  options.push(valueToOption(value));

  saveTags(tags);
}

function InputTags ({ allowAdd = true, className = '', defaultValue, help, isDisabled, isError, label, onBlur, onChange, onClose, placeholder, searchInput, value, withLabel }: Props): React.ReactElement<Props> {
  const { theme } = useContext(ThemeContext as React.Context<ThemeDef>);

  return (
    <Dropdown
      allowAdd={allowAdd && !isDisabled}
      className={`ui--InputTags ${theme}Theme ${className}`}
      defaultValue={defaultValue}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      isMultiple
      label={label}
      onAdd={onAddTag}
      onBlur={onBlur}
      onChange={onChange}
      onClose={onClose}
      options={options}
      placeholder={placeholder}
      searchInput={searchInput}
      value={value}
      withLabel={withLabel}
    />
  );
}

export default React.memo(styled(InputTags)`
  && .ui.label {
    border: none;
    border-radius: 0.25rem;
    box-shadow: none;
    color: #fff;
    display: inline-block;
    font-size: 0.857rem;
    font-weight: var(--font-weight-normal);
    line-height: 1.143rem;
    margin: 0.125rem 0.125rem;
    padding: 0.571em 0.857em;
    position: relative;
    white-space: nowrap;
    z-index: 1;

    .delete.icon::before {
      content: '\u2715';
    }
  }

  &&.darkTheme .ui.label {
    background-color: rgba(255, 255, 255, 0.08);
  }
`);
