// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallFunction } from '@polkadot/types/types';
import { BareProps } from '../types';
import { DropdownOptions } from '../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  api: ApiPromise;
  isError?: boolean;
  onChange: (value: CallFunction) => void;
  options: DropdownOptions;
  value: CallFunction;
}

function transform ({ api, value }: Props): (method: string) => CallFunction {
  return (method: string): CallFunction => {
    return api.tx[value.section][method];
  };
}

export default function SelectMethod (props: Props): React.ReactElement<Props> | null {
  const { className, isError, onChange, options, style, value } = props;
  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      transform={transform(props)}
      value={value.method}
      withLabel={false}
    />
  );
}
