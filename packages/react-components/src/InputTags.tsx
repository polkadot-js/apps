// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import store from 'store';

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
  return (
    <Dropdown
      allowAdd={allowAdd && !isDisabled}
      className={className}
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

export default React.memo(InputTags);
