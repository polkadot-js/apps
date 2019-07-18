// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic & InputStorage

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import map from '@polkadot/jsonrpc';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

interface Props extends I18nProps {
  defaultValue: RpcMethod;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: RpcMethod) => void;
  withLabel?: boolean;
}

interface State {
  optionsMethod: DropdownOptions;
  optionsSection: DropdownOptions;
  value: RpcMethod;
}

class InputRpc extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { section } = this.props.defaultValue;

    this.state = {
      optionsMethod: methodOptions(section),
      optionsSection: sectionOptions(),
      value: this.props.defaultValue
    };
  }

  public render (): React.ReactNode {
    const { className, help, label, style, withLabel } = this.props;
    const { optionsMethod, optionsSection, value } = this.state;

    return (
      <div
        className={className}
        style={style}
      >
        <Labelled
          help={help}
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
              className='large'
              onChange={this.onMethodChange}
              options={optionsMethod}
              value={value}
            />
          </div>
        </Labelled>
      </div>
    );
  }

  private onMethodChange = (newValue: RpcMethod): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, (): void =>
      onChange && onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = methodOptions(newSection);
    const newValue = map[newSection].methods[optionsMethod[0].value];

    this.setState({ optionsMethod }, (): void =>
      this.onMethodChange(newValue)
    );
  }
}

export default translate(InputRpc);
