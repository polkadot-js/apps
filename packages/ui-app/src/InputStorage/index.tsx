// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { SectionItem } from '@polkadot/params/types';
import { Storages, Storage$Sections } from '@polkadot/storage/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';

import map from '@polkadot/storage';

import classes from '../util/classes';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = I18nProps & {
  defaultValue: SectionItem<Storages>,
  isError?: boolean,
  labelMethod?: string,
  labelSection?: string,
  onChange: (value: SectionItem<Storages>) => void,
  withLabel?: boolean
};

type State = {
  optionsMethod: DropdownOptions,
  optionsSection: DropdownOptions,
  value: SectionItem<Storages>
};

class InputStorage extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { section } = this.props.defaultValue;

    this.state = {
      optionsMethod: keyOptions(section),
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

  onKeyChange = (value: SectionItem<Storages>): void => {
    const { onChange } = this.props;
    const { value: { name, section } } = this.state;

    if (value.section === section && value.name === name) {
      return;
    }

    this.setState({ value }, () =>
      onChange(value)
    );
  }

  onSectionChange = (newSection: Storage$Sections): void => {
    const { value: { section } } = this.state;

    if (newSection === section) {
      return;
    }

    const optionsMethod = keyOptions(newSection);
    const value = map[newSection].public[optionsMethod[0].value];

    this.setState({ optionsMethod }, () =>
      this.onKeyChange(value)
    );
  }
}

export default translate(InputStorage);
