// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import { Interface$Method, Interface$Sections } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../InputExtrinsic/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';

import map from '@polkadot/jsonrpc';

import classes from '../util/classes';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = I18nProps & {
  defaultValue: Interface$Method,
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: Interface$Method) => void,
  withLabel?: boolean
};

type State = {
  optionsMethod: DropdownOptions,
  optionsSection: DropdownOptions,
  value: Interface$Method
};

class InputRpc extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { section } = this.props.defaultValue;

    this.state = {
      optionsMethod: methodOptions(section),
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
        <SelectMethod
          className='large'
          label={labelMethod}
          onChange={this.onMethodChange}
          options={optionsMethod}
          value={value}
          withLabel={withLabel}
        />
      </div>
    );
  }

  onMethodChange = (value: Interface$Method): void => {
    const { onChange } = this.props;
    const { value: { name, section } } = this.state;

    if (value.section === section && value.name === name) {
      return;
    }

    this.setState({ value }, () =>
      onChange(value)
    );
  }

  onSectionChange = (newSection: Interface$Sections): void => {
    const { value: { section } } = this.state;

    if (newSection === section) {
      return;
    }

    const optionsMethod = methodOptions(newSection);
    // @ts-ignore check?
    const value = map.get(newSection).public[optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onMethodChange(value)
    );
  }
}

export default translate(InputRpc);
