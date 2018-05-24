// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputStorage

import type { Extrinsic$Method, Extrinsic$Sections } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';
import type { DropdownOptions } from './types';

import './InputExtrinsic.css';

import React from 'react';
import map from '@polkadot/extrinsics-substrate';

import classes from '../util/classes';
import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';
import sectionOptions from './options/section';

type Props = I18nProps & {
  defaultValue: Extrinsic$Method,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: Extrinsic$Method) => void,
  withLabel?: boolean
};

type State = {
  optionsMethod: DropdownOptions,
  optionsSection: DropdownOptions,
  type: 'private' | 'public',
  value: Extrinsic$Method
};

class InputExtrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = ({
      value: this.props.defaultValue
    }: $Shape<State>);
  }

  static getDerivedStateFromProps ({ isPrivate = false }: Props, { type, value: { section } }: State): $Shape<State> {
    const newType = isPrivate ? 'private' : 'public';

    if (newType === type) {
      return null;
    }

    return {
      optionsMethod: methodOptions(section, newType),
      optionsSection: sectionOptions(newType),
      type: newType
    };
  }

  render (): React$Node {
    const { className, labelMethod, labelSection, style, withLabel } = this.props;
    const { optionsMethod, optionsSection, type, value } = this.state;

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
          type={type}
          withLabel={withLabel}
        />
      </div>
    );
  }

  onKeyChange = (value: Extrinsic$Method): void => {
    const { onChange } = this.props;
    const { value: { name, section } } = this.state;

    if (value.section === section && value.name === name) {
      return;
    }

    this.setState({ value }, () =>
      onChange(value)
    );
  }

  onSectionChange = (newSection: Extrinsic$Sections): void => {
    const { type, value: { section } } = this.state;

    if (newSection === section) {
      return;
    }

    const optionsMethod = methodOptions(newSection, type);
    const value = map[newSection][type][optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(value)
    );
  }
}

export default translate(InputExtrinsic);
