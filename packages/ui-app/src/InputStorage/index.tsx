// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { StorageFunction } from '@polkadot/types/StorageKey';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import Api from '@polkadot/api-observable';

import classes from '../util/classes';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = I18nProps & {
  defaultValue: StorageFunction,
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: StorageFunction) => void,
  withLabel?: boolean
};

type State = {
  optionsMethod: DropdownOptions,
  optionsSection: DropdownOptions,
  value: StorageFunction
};

class InputStorage extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const method = this.props.defaultValue;

    this.state = {
      optionsMethod: keyOptions(method.section),
      optionsSection: sectionOptions(),
      value: this.props.defaultValue
    };
  }

  render () {
    const { className, labelMethod, labelSection, style, withLabel } = this.props;
    const { optionsMethod, optionsSection, value } = this.state;

    return (
      <div
        className={classes('ui--DropdownLinked', 'ui--row', className)}
        style={style}
      >
        <SelectSection
          className='small'
          label={labelSection}
          onChange={this.onSectionChange}
          options={optionsSection}
          value={value}
          withLabel={withLabel}
        />
        <SelectKey
          className='large'
          label={labelMethod}
          onChange={this.onKeyChange}
          options={optionsMethod}
          value={value}
          withLabel={withLabel}
        />
      </div>
    );
  }

  private onKeyChange = (newValue: StorageFunction): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, () =>
      onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = keyOptions(newSection);
    const newValue = Api.storage[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(newValue)
    );
  }
}

export default translate(InputStorage);
