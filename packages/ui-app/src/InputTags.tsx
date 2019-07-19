// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import store from 'store';

import Dropdown from './Dropdown';

interface Option {
  key: string;
  text: string;
  value: string;
}

interface Props extends BareProps {
  allowAdd?: boolean;
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

interface State {
  options: Option[];
}

function loadTags (): string[] {
  return store.get('tags') || ['Default'];
}

function saveTags (tags: string[]): void {
  store.set('tags', tags);
}

const tags = loadTags();

export default class InputTags extends React.PureComponent<Props> {
  public state: State = {
    options: tags.map((value): { key: string; text: string; value: string } => ({
      key: value, text: value, value
    }))
  };

  public render (): React.ReactNode {
    const { className, defaultValue, help, isDisabled, isError, label, onBlur, onChange, onClose, placeholder, searchInput, value, withLabel } = this.props;
    const { options } = this.state;

    return (
      <Dropdown
        allowAdd={!isDisabled}
        className={className}
        defaultValue={defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={isError}
        isMultiple
        label={label}
        onAdd={this.onAdd}
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

  private onAdd = (value: string): void => {
    tags.push(value);
    saveTags(tags);

    this.setState(({ options }: State): Pick<State, never> => ({
      options: [...options, { key: value, text: value, value }]
    }));
  }
}
