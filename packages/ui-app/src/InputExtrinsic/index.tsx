// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { MethodFunction } from '@polkadot/types/primitive/Method';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import './InputExtrinsic.css';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = ApiProps & I18nProps & {
  defaultValue: MethodFunction,
  isDisabled?: boolean,
  isError?: boolean,
  isPrivate?: boolean,
  label: React.ReactNode,
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

  static getDerivedStateFromProps ({ api }: Props, { value }: State): State | null {
    return {
      optionsMethod: methodOptions(api, value.section),
      optionsSection: sectionOptions(api)
    } as State;
  }

  render () {
    const { api, className, label, style, withLabel } = this.props;
    const { optionsMethod, optionsSection, value } = this.state;

    return (
      <div
        className={className}
        style={style}
      >
        <Labelled
          label={label}
          withLabel={withLabel}
        >
          <div className=' ui--DropdownLinked ui--row'>
            <SelectSection
              className='small'
              onChange={this.onSectionChange}
              options={optionsSection}
              value={value}
            />
            <SelectMethod
              api={api}
              className='large'
              onChange={this.onKeyChange}
              options={optionsMethod}
              value={value}
            />
          </div>
        </Labelled>
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
    const { api } = this.props;
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = methodOptions(api, newSection);
    const fn = api.tx[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(fn)
    );
  }
}

export default withMulti(
  InputExtrinsic,
  translate,
  withApi
);
