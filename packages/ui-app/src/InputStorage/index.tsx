// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { StorageFunction } from '@polkadot/types/StorageKey';
import { ApiProps } from '@polkadot/ui-api/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import { withApi, withMulti } from '@polkadot/ui-api/index';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = ApiProps & I18nProps & {
  defaultValue: StorageFunction,
  isError?: boolean,
  label: React.ReactNode,
  onChange?: (value: StorageFunction) => void,
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

    const { api, defaultValue: { section } } = this.props;

    this.state = {
      optionsMethod: keyOptions(api, section),
      optionsSection: sectionOptions(api),
      value: this.props.defaultValue
    };
  }

  render () {
    const { className, label, style, withLabel } = this.props;
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
            <SelectKey
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

  private onKeyChange = (newValue: StorageFunction): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, () =>
      onChange && onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { api } = this.props;
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = keyOptions(api, newSection);
    const newValue = api.query[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(newValue)
    );
  }
}

export default withMulti(
  InputStorage,
  translate,
  withApi
);
