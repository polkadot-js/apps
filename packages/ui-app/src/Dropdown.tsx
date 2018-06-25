// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIDropdown from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';

import classes from './util/classes';
import Labelled from './Labelled';

type Props<Option> = BareProps & {
  defaultValue?: any,
  isDisabled?: boolean,
  isError?: boolean,
  label?: any, // node?
  onChange: (value: any) => void,
  onSearch?: (filteredOptions: Array<Option>, query: string) => Array<Option>,
  options: Array<Option>,
  placeholder?: string,
  transform?: (value: any) => any,
  value?: any,
  withLabel?: boolean,
};

type SUIEvent = {
  value: string
};

export default class Dropdown<Option> extends React.PureComponent<Props<Option>> {
  render () {
    const { className, defaultValue, isDisabled, isError, label, onSearch, options, placeholder, style, withLabel, value } = this.props;

    return (
      <Labelled
        className={classes('ui--Dropdown', className)}
        label={label}
        style={style}
        withLabel={withLabel}
      >
        <SUIDropdown
          defaultValue={defaultValue}
          disabled={isDisabled}
          error={isError}
          // @ts-ignore some mismatch here, look into it
          onChange={this.onChange}
          options={options}
          placeholder={placeholder}
          // @ts-ignore some mismatch here, look into it
          search={onSearch}
          selection
          value={value}
        />
      </Labelled>
    );
  }

  onChange = (event: React.SyntheticEvent<Element>, { value }: SUIEvent): void => {
    const { onChange, transform } = this.props;

    onChange(
      transform
        ? transform(value)
        : value
    );
  }
}
