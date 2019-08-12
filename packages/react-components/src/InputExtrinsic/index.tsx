// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '../types';
import { DropdownOptions } from '../util/types';

import './InputExtrinsic.css';

import React from 'react';
import { withApi, withMulti } from '@polkadot/react-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = ApiProps & I18nProps & {
  defaultValue: CallFunction;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isPrivate?: boolean;
  label: React.ReactNode;
  onChange: (value: CallFunction) => void;
  withLabel?: boolean;
};

interface State {
  optionsMethod?: DropdownOptions;
  optionsSection?: DropdownOptions;
  value: CallFunction;
}

class InputExtrinsic extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      value: this.props.defaultValue
    };
  }

  public static getDerivedStateFromProps ({ api }: Props, { value }: State): Pick<State, never> {
    return {
      optionsMethod: methodOptions(api, value.section),
      optionsSection: sectionOptions(api)
    };
  }

  public render (): React.ReactNode {
    const { api, className, help, label, style, withLabel } = this.props;
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
              options={optionsSection || []}
              value={value}
            />
            <SelectMethod
              api={api}
              className='large'
              onChange={this.onKeyChange}
              options={optionsMethod || []}
              value={value}
            />
          </div>
        </Labelled>
      </div>
    );
  }

  private onKeyChange = (newValue: CallFunction): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.section === newValue.section && value.method === newValue.method) {
      return;
    }

    this.setState({ value: newValue }, (): void =>
      onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { api } = this.props;
    const { value } = this.state;

    if (newSection === value.section) {
      return;
    }

    const optionsMethod = methodOptions(api, newSection);
    const fn = api.tx[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, (): void =>
      this.onKeyChange(fn)
    );
  }
}

export default withMulti(
  InputExtrinsic,
  translate,
  withApi
);
