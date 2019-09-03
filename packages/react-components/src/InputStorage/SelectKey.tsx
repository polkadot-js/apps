// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StorageEntryPromise } from '@polkadot/api/types';
import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';

import React, { useContext } from 'react';
import { ApiContext } from '@polkadot/react-api';

import Dropdown from '../Dropdown';
import { classes } from '../util';

type Props = BareProps & {
  isError?: boolean;
  onChange: (value: StorageEntryPromise) => void;
  options: DropdownOptions;
  value: StorageEntryPromise;
};

function transform ({ value }: Props): (method: string) => StorageEntryPromise {
  const { api } = useContext(ApiContext);
  return function (method: string): StorageEntryPromise {
    return api.query[value.creator.section]
      ? api.query[value.creator.section][method]
      : value;
  };
}

function SelectKey (props: Props): React.ReactElement<Props> | null {
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
      value={value.creator.method}
      withLabel={false}
    />
  );
}

export default SelectKey;
