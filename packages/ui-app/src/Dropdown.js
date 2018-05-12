// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from './types';

import React from 'react';
import SUIDropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import Labelled from './Labelled';

type Props = BareProps & {
  defaultValue?: mixed,
  isError?: boolean,
  label?: React$Node,
  // flowlint-next-line unclear-type:off
  onChange: (value: any) => void,
  // flowlint-next-line unclear-type:off
  transform?: (value: any) => any
};

type SUIEvent = {
  // flowlint-next-line unclear-type:off
  value: any
};

export default class Dropdown extends React.PureComponent<Props> {
  render (): React$Node {
    const { className, isError, label, style } = this.props;
    const _props = {...this.props};

    delete _props.className;
    delete _props.isError;
    delete _props.label;
    delete _props.onChange;
    delete _props.style;
    delete _props.transform;

    return (
      <Labelled
        className={['ui--Dropdown', className].join(' ')}
        label={label}
        style={style}
      >
        <SUIDropdown
          selection
          {..._props}
          error={isError}
          onChange={this.onChange}
        />
      </Labelled>
    );
  }

  onChange = (event: SyntheticEvent<*>, { value }: SUIEvent): void => {
    const { onChange, transform } = this.props;

    onChange(
      transform
        ? transform(value)
        : value
    );
  }
}
