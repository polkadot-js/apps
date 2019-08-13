// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// TODO: We have a lot shared between this and InputExtrinsic

import { ApiProps } from '@polkadot/react-api/types';
import { StorageEntryPromise } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import '../InputExtrinsic/InputExtrinsic.css';

import React from 'react';
import { withApi, withMulti } from '@polkadot/react-api';

import Labelled from '../Labelled';
import translate from '../translate';
import SelectKey from './SelectKey';
import SelectSection from './SelectSection';
import keyOptions from './options/key';
import sectionOptions from './options/section';

type Props = ApiProps & I18nProps & {
  defaultValue: StorageEntryPromise;
  help?: React.ReactNode;
  isError?: boolean;
  label: React.ReactNode;
  onChange?: (value: StorageEntryPromise) => void;
  withLabel?: boolean;
};

interface State {
  optionsMethod: DropdownOptions;
  optionsSection: DropdownOptions;
  value: StorageEntryPromise;
}

class InputStorage extends React.PureComponent<Props, State> {
  public state: State;

  public constructor (props: Props) {
    super(props);

    const { api, defaultValue: { creator: { method, section } } } = this.props;

    this.state = {
      optionsMethod: keyOptions(api, section),
      optionsSection: sectionOptions(api),
      value: api.query[section][method]
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

  private onKeyChange = (newValue: StorageEntryPromise): void => {
    const { onChange } = this.props;
    const { value } = this.state;

    if (value.creator.section === newValue.creator.section && value.creator.method === newValue.creator.method) {
      return;
    }

    this.setState({ value: newValue }, (): void =>
      onChange && onChange(newValue)
    );
  }

  private onSectionChange = (newSection: string): void => {
    const { api } = this.props;
    const { value } = this.state;

    if (newSection === value.creator.section) {
      return;
    }

    const optionsMethod = keyOptions(api, newSection);
    const newValue = api.query[newSection][optionsMethod[0].value];

    this.setState({ optionsMethod }, (): void =>
      this.onKeyChange(newValue)
    );
  }
}

export default withMulti(
  InputStorage,
  translate,
  withApi
);
