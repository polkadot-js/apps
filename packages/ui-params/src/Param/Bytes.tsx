// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Props } from '../types';

import React from 'react';
import { Compact } from '@polkadot/types';
import { Button } from '@polkadot/ui-app';

import BaseBytes from './BaseBytes';
import File from './File';

type State = {
  isFileDrop: boolean
};

export default class Bytes extends React.PureComponent<Props, State> {
  state: State = {
    isFileDrop: false
  };

  render () {
    const { isDisabled } = this.props;
    const { isFileDrop } = this.state;

    return !isDisabled && isFileDrop
      ? this.renderFile()
      : this.renderInput();
  }

  private renderInput () {
    const { className, defaultValue, isDisabled, isError, label, name, onChange, onEnter, style, type, withLabel } = this.props;

    return (
      <BaseBytes
        className={className}
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        length={-1}
        name={name}
        onChange={onChange}
        onEnter={onEnter}
        size='full'
        style={style}
        type={type}
        withLabel={withLabel}
        withLength
      >
        {this.renderFileButton()}
      </BaseBytes>
    );
  }

  private renderFileButton () {
    const { isDisabled } = this.props;

    if (isDisabled) {
      return null;
    }

    return (
      <Button
        icon='file'
        isPrimary
        onClick={this.toggleFile}
      />
    );
  }

  private renderFile () {
    const { className, isDisabled, isError, label, style, withLabel } = this.props;

    return (
      <File
        className={className}
        isDisabled={isDisabled}
        isError={isError}
        label={label}
        onChange={this.onChangeFile}
        style={style}
        withLabel={withLabel}
      />
    );
  }

  private toggleFile = () => {
    this.setState(({ isFileDrop }: State) => ({
      isFileDrop: !isFileDrop
    }));
  }

  private onChangeFile = (value: Uint8Array): void => {
    const { onChange } = this.props;

    onChange && onChange({
      isValid: value.length !== 0,
      value: Compact.addLengthPrefix(value)
    });
  }
}
