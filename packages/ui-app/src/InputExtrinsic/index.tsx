// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/Method';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import './InputExtrinsic.css';

import React from 'react';
import Api from '@polkadot/api-observable';

import classes from '../util/classes';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = I18nProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: MethodFunction) => void,
  withLabel?: boolean
};

type State = {
  optionsMethod: DropdownOptions,
  optionsSection: DropdownOptions,
  value: MethodFunction
};

class InputExtrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      value: this.props.defaultValue
    } as State;
  }

  static getDerivedStateFromProps (props: Props, { value }: State): State | null {
    return {
      optionsMethod: methodOptions(value.section),
      optionsSection: sectionOptions()
    } as State;
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
        <SelectMethod
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

  onKeyChange = (newValue: MethodFunction): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, () =>
      onChange(newValue)
    );
  }

  onSectionChange = (newSection: string): void => {
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = methodOptions(newSection);
    const fn = Api.extrinsics[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(fn)
    );
  }
}

export default translate(InputExtrinsic);
