// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import SUIButton from 'semantic-ui-react/dist/commonjs/elements/Button/Button';
import SUIDropdown, { DropdownProps } from 'semantic-ui-react/dist/commonjs/modules/Dropdown/Dropdown';
import { isUndefined } from '@polkadot/util';

import { classes } from './util';
import Labelled from './Labelled';

type Props<Option> = BareProps & {
  defaultValue?: any,
  dropdownClassName?: string,
  help?: React.ReactNode,
  isButton?: boolean,
  isDisabled?: boolean,
  isError?: boolean,
  isMultiple?: boolean,
  label?: React.ReactNode,
  onChange?: (value: any) => void,
  onSearch?: (filteredOptions: Array<any>, query: string) => Array<Option>,
  options: Array<Option>,
  placeholder?: string,
  renderLabel?: (item: any) => any,
  transform?: (value: any) => any,
  value?: any,
  withLabel?: boolean
};

export default class Dropdown<Option> extends React.PureComponent<Props<Option>> {
  // Trigger the update on mount - ensuring that the onChange (as described below)
  // is trigerred.
  componentDidMount () {
    this.componentDidUpdate({} as Props<Option>);
  }

  // Here we update the component user with the initial value of the dropdown. In a number of
  // these (e.g. Accounts) the list of available values are managed by the component itself,
  // and there are defaults set (i.e. for accounts the last one used)
  componentDidUpdate (prevProps: Props<Option>) {
    const { defaultValue, value } = this.props;
    const startValue = isUndefined(value)
      ? defaultValue
      : value;
    const prevStart = isUndefined(prevProps.value)
      ? prevProps.defaultValue
      : prevProps.value;

    if (startValue !== prevStart) {
      this.onChange(null as any, {
        value: startValue
      });
    }
  }

  render () {
    const { className, defaultValue, dropdownClassName, help, isButton, isDisabled, isError, isMultiple, label, onSearch, options, placeholder, renderLabel, style, withLabel, value } = this.props;
    const dropdown = (
      <SUIDropdown
        className={dropdownClassName}
        button={isButton}
        compact={isButton}
        disabled={isDisabled}
        error={isError}
        floating={isButton}
        multiple={isMultiple}
        onChange={this.onChange}
        options={options}
        placeholder={placeholder}
        renderLabel={renderLabel}
        search={onSearch}
        selection
        value={
          isUndefined(value)
            ? defaultValue
            : value
        }
      />
    );

    return isButton
      ? (
        <SUIButton.Group primary>
          {dropdown}
        </SUIButton.Group>
      )
      : (
        <Labelled
          className={classes('ui--Dropdown', className)}
          help={help}
          label={label}
          style={style}
          withLabel={withLabel}
        >
          {dropdown}
        </Labelled>
      );
  }

  private onChange = (_: React.SyntheticEvent<HTMLElement>, { value }: DropdownProps): void => {
    const { onChange, transform } = this.props;

    onChange && onChange(
      transform
        ? transform(value)
        : value
    );
  }
}
