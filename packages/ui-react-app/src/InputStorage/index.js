// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

// TODO: We have a lot shared between this and InputExtrinsic

import type { StorageDef$Key, StateDb$SectionNames } from '@polkadot/storage/types';
import type { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import map from '@polkadot/storage-substrate/keys';

import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';

type Props = I18nProps & {
  defaultValue: StorageDef$Key,
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: StorageDef$Key) => void,
};

type State = {
  value: StorageDef$Key
};

class InputStorage extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      value: this.props.defaultValue
    };
  }

  render (): React$Node {
    const { className, labelMethod, labelSection, style } = this.props;
    const { value } = this.state;

    return (
      <div
        className={['ui--RxDropdownLinked', 'ui--form', className].join(' ')}
        style={style}
      >
        <div className='small'>
          <SelectSection
            label={labelSection}
            onChange={this.onSectionChange}
            value={value}
          />
        </div>
        <div className='large'>
          <SelectKey
            label={labelMethod}
            onChange={this.onKeyChange}
            value={value}
          />
        </div>
      </div>
    );
  }

  onKeyChange = (value: StorageDef$Key): void => {
    const { onChange } = this.props;

    this.setState({ value }, () =>
      onChange(value)
    );
  }

  onSectionChange = (section: StateDb$SectionNames): void => {
    if (this.state.value.section === section) {
      return;
    }

    const options = keyOptions(section);
    const value = map[section].keys[options[0].value];

    this.onKeyChange(value);
  }
}

export default translate(InputStorage);
