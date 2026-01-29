// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { QueryableStorageEntry } from '@polkadot/api/types';
import type { DropdownOptions } from '../util/types.js';

import React from 'react';

import { useApi } from '@polkadot/react-hooks';

import Dropdown from '../Dropdown.js';
import { filterDropdownItems } from '../util/index.js';

interface Props {
  className?: string;
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
      className={`${className} ui--DropdownLinked-Items`}
      isError={isError}
      onChange={onChange}
      onSearch={filterDropdownItems}
      options={options}
      transform={transform(api, props)}
      value={value.creator.method}
      withLabel={false}
    />
  );
}

export default React.memo(SelectKey);
