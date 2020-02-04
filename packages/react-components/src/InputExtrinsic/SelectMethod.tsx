// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import { BareProps } from '../types';
import { DropdownOptions } from '../util/types';

import React from 'react';
import ApiPromise from '@polkadot/api/promise';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  api: ApiPromise;
  isError?: boolean;
  onChange: (value: SubmittableExtrinsicFunction<'promise'>) => void;
  options: DropdownOptions;
  value: SubmittableExtrinsicFunction<'promise'>;
}

export default function SelectMethod ({ api, className, isError, onChange, options, style, value }: Props): React.ReactElement<Props> | null {
  if (!options.length) {
    return null;
  }

  const transform = (method: string): SubmittableExtrinsicFunction<'promise'> => api.tx[value.section][method];

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      style={style}
      transform={transform}
      value={value.method}
      withLabel={false}
    />
  );
}
