// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DropdownOptions } from '../util/types';
import { BareProps } from '../types';
import { StorageEntryPromise } from './types';

import React from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@polkadot/react-hooks';

import Dropdown from '../Dropdown';
import { classes } from '../util';

interface Props extends BareProps {
  isError?: boolean;
  onChange: (value: StorageEntryPromise) => void;
  options: DropdownOptions;
  value: StorageEntryPromise;
}

function transform (api: ApiPromise, { value }: Props): (method: string) => StorageEntryPromise {
  return function (method: string): StorageEntryPromise {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return api.query[value.creator.section]
      ? api.query[value.creator.section][method] as any
      : value;
  };
}

function SelectKey (props: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { className = '', isError, onChange, options, value } = props;

  if (!options.length) {
    return null;
  }

  return (
    <Dropdown
      className={classes('ui--DropdownLinked-Items', className)}
      isError={isError}
      onChange={onChange}
      options={options}
      transform={transform(api, props)}
      value={value.creator.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectKey);
