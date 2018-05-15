// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import SUIDropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import classes from './util/classes';
import Labelled from './Labelled';

type Props = BareProps & {
  defaultValue?: mixed,
  isDisabled?: boolean,
  isError?: boolean,
  label?: React$Node,
  // flowlint-next-line unclear-type:off
  onChange: (value: any) => void,
  // flowlint-next-line unclear-type:off
  onSearch?: (filteredOptions: Array<any>, query: string) => Array<any>,
  // flowlint-next-line unclear-type:off
  options: Array<any>,
  // flowlint-next-line unclear-type:off
  transform?: (value: any) => any,
  value?: mixed,
  withLabel?: boolean,
};

type SUIEvent = {
  // flowlint-next-line unclear-type:off
  value: any
};

export default class Dropdown extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, defaultValue, isDisabled, isError, label, onSearch, options, style, withLabel, value } = this.props;

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
          onChange={this.onChange}
          options={options}
          search={onSearch}
          selection
          value={value}
        />
      </Labelled>
    );
  }

  // flowlint-next-line unclear-type:off
  onChange = (event: SyntheticEvent<any>, { value }: SUIEvent): void => {
    const { onChange, transform } = this.props;

    onChange(
      transform
        ? transform(value)
        : value
    );
  }
}
