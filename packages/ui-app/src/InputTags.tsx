// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import store from 'store';

import Dropdown from './Dropdown';

type Option = {
  key: string,
  text: string,
  value: string
};

type Props = BareProps & {
  allowAdd?: boolean,
  defaultValue?: Array<string>,
  help?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  label?: React.ReactNode,
  onBlur?: () => void;
  onChange?: (value: Array<string>) => void,
  onClose?: () => void;
  openOnFocus?: boolean;
  placeholder?: string,
  searchInput?: {autoFocus: boolean},
  value?: Array<string>,
  withLabel?: boolean
};

type State = {
  options: Array<Option>
};

function loadTags (): Array<string> {
  return store.get('tags') || ['Default'];
}

function saveTags (tags: Array<string>): void {
  store.set('tags', tags);
}

const tags = loadTags();

export default class InputTags extends React.PureComponent<Props> {
  state: State = {
    options: tags.map((value) => ({
      key: value, text: value, value
    }))
  };

  render () {
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

    this.setState(({ options }: State) => ({
      options: [...options, { key: value, text: value, value }]
    }));
  }
}
