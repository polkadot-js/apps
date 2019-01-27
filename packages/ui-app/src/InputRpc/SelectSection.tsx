// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { DropdownOptions } from '../util/types';
import { I18nProps } from '../types';

import React from 'react';

import Dropdown from '../Dropdown';
import classes from '../util/classes';
import translate from '../translate';

type Props = I18nProps & {
  defaultValue?: string,
  isError?: boolean,
  onChange: (value: string) => void,
  options: DropdownOptions,
  value: RpcMethod
};

class SelectSection extends React.PureComponent<Props> {
  render () {
    const { className, defaultValue, isError, onChange, options, style, t, value } = this.props;

    return (
      <Dropdown
        className={classes('ui--DropdownLinked-Sections', className)}
        defaultValue={defaultValue}
        isError={isError}
        onChange={onChange}
        options={options}
        style={style}
        value={value.section}
        withLabel={false}
      />
    );
  }
}

export default translate(SelectSection);
