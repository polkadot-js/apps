// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputStorage

import type { Extrinsic, ExtrinsicSectionName } from '@polkadot/extrinsics/types';
import type { I18nProps } from '../types';

import './InputExtrinsic.css';

import React from 'react';
import map from '@polkadot/extrinsics-substrate';

import translate from '../translate';
import SelectMethod from './SelectMethod';
import SelectSection from './SelectSection';
import methodOptions from './options/method';

type Props = I18nProps & {
  defaultValue: Extrinsic,
  isError?: boolean,
  isPrivate?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: Extrinsic) => void
};

type State = {
  value: Extrinsic
};

class InputExtrinsic extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      value: this.props.defaultValue
    };
  }

  render (): React$Node {
    const { className, isPrivate = false, labelMethod, labelSection, style } = this.props;
    const { value } = this.state;
    const type = isPrivate ? 'private' : 'public';

    return (
      <div
        className={['ui--RxDropdownLinked', 'ui--row', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection}
            onChange={this.onSectionChange}
            type={type}
            value={value}
          />
        </div>
        <div className='large'>
          <SelectMethod
            label={labelMethod}
            onChange={this.onKeyChange}
            value={value}
            type={type}
          />
        </div>
      </div>
    );
  }

  onKeyChange = (value: Extrinsic): void => {
    const { onChange } = this.props;

    this.setState({ value }, () =>
      onChange(value)
    );
  }

  onSectionChange = (section: ExtrinsicSectionName): void => {
    const { isPrivate = false } = this.props;

    if (this.state.value.section === section) {
      return;
    }

    const type = isPrivate ? 'private' : 'public';
    const options = methodOptions(section, type);
    const value = map[section].methods[type][options[0].value];

    this.onKeyChange(value);
  }
}

export default translate(InputExtrinsic);
