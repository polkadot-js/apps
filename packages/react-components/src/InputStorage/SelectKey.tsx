// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueryableStorageEntry } from '@polkadot/api/types';
import { DropdownOptions } from '@canvas-ui/react-util/types';
import { BareProps } from '../types';

import React from 'react';
import { ApiPromise } from '@polkadot/api';
import { useApi } from '@canvas-ui/react-hooks';

import Dropdown from '../Dropdown';
import { classes } from '@canvas-ui/react-util';

interface Props extends BareProps {
  isError?: boolean;
  onChange: (value: QueryableStorageEntry<'promise'>) => void;
  options: DropdownOptions;
  value: QueryableStorageEntry<'promise'>;
}

function transform (api: ApiPromise, { value }: Props): (method: string) => QueryableStorageEntry<'promise'> {
  return function (method: string): QueryableStorageEntry<'promise'> {
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
